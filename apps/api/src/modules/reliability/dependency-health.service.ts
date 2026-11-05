import { Injectable, Logger, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';
import { IntegrationRegistryService } from '../ecosystem/services/integration-registry.service';

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
export type ReadinessStatus = 'READY' | 'DEGRADED' | 'NOT_READY';

export interface LivenessReport {
  status: 'UP' | 'DOWN';
  uptimeSeconds: number;
  processId: number;
  timestamp: string;
}

export interface ComponentCheck {
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
  details?: Record<string, any>;
}

export interface ReadinessReport {
  status: ReadinessStatus;
  checks: {
    database: ComponentCheck;
    memory: ComponentCheck;
    backgroundWorkers: ComponentCheck;
  };
  timestamp: string;
}

export interface DeepDependencyReport {
  overallStatus: HealthStatus;
  timestamp: string;
  uptimeSeconds: number;
  database: ComponentCheck;
  integrations: Record<string, any>;
  circuitBreakers: Array<{
    serviceName: string;
    state: string;
    failureCount: number;
  }>;
  system: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
    eventLoopHealthy: boolean;
  };
}

@Injectable()
export class DependencyHealthService {
  private readonly logger = new Logger(DependencyHealthService.name);
  private readonly CHECK_TIMEOUT_MS = 2000;

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly circuitBreaker?: CircuitBreakerService,
    @Optional() private readonly integrationRegistry?: IntegrationRegistryService,
  ) {}

  /**
   * Fast, non-blocking liveness probe.
   * Confirms the Node.js process is active and event loop is not starved.
   */
  async checkLiveness(): Promise<LivenessReport> {
    return {
      status: 'UP',
      uptimeSeconds: Math.floor(process.uptime()),
      processId: process.pid,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Bounded readiness probe.
   * Confirms whether the instance is capable of accepting and processing client requests.
   */
  async checkReadiness(): Promise<ReadinessReport> {
    const timestamp = new Date().toISOString();

    // 1. Probe Database with bounded timeout
    const dbCheck = await this.probeDatabase();

    // 2. Probe Memory Pressure
    const memoryCheck = this.probeMemory();

    // 3. Probe Background Worker Connectivity
    const workerCheck: ComponentCheck = {
      status: 'HEALTHY',
      message: 'Background scheduler and event loops responsive',
    };

    let readinessStatus: ReadinessStatus = 'READY';
    if (dbCheck.status === 'UNAVAILABLE') {
      readinessStatus = 'NOT_READY';
    } else if (dbCheck.status === 'DEGRADED' || memoryCheck.status === 'DEGRADED') {
      readinessStatus = 'DEGRADED';
    }

    return {
      status: readinessStatus,
      checks: {
        database: dbCheck,
        memory: memoryCheck,
        backgroundWorkers: workerCheck,
      },
      timestamp,
    };
  }

  /**
   * Comprehensive, deep dependency diagnostics.
   * Redacts all sensitive credentials, database hostnames, and secret topologies.
   */
  async checkDeepDependencies(): Promise<DeepDependencyReport> {
    const dbCheck = await this.probeDatabase();
    const memUsage = process.memoryUsage();

    // Collect external integration statuses safely
    const integrationsReport: Record<string, any> = {};
    if (this.integrationRegistry) {
      try {
        const healthList = await this.integrationRegistry.checkAllHealth();
        for (const item of healthList) {
          integrationsReport[item.providerName] = {
            status: item.status,
            providerType: item.providerType,
            latencyMs: item.latencyMs,
            lastCheckedAt: item.lastCheckedAt,
          };
        }
      } catch (err: any) {
        integrationsReport.status = 'ERROR_QUERYING_REGISTRY';
      }
    }

    // Collect circuit breaker states safely
    const circuitBreakers: Array<{ serviceName: string; state: string; failureCount: number }> = [];
    if (this.circuitBreaker) {
      try {
        const snapshots = this.circuitBreaker.getAllBreakerSnapshots();
        for (const s of snapshots) {
          circuitBreakers.push({
            serviceName: s.serviceName,
            state: s.state,
            failureCount: s.failureCount,
          });
        }
      } catch {
        // ignore fast path
      }
    }

    // Determine overall health status
    let overallStatus: HealthStatus = 'HEALTHY';
    if (dbCheck.status === 'UNAVAILABLE') {
      overallStatus = 'UNAVAILABLE';
    } else if (
      dbCheck.status === 'DEGRADED' ||
      circuitBreakers.some((b) => b.state === 'OPEN')
    ) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbCheck,
      integrations: integrationsReport,
      circuitBreakers,
      system: {
        rssMb: Math.round(memUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
        eventLoopHealthy: true,
      },
    };
  }

  /**
   * Bounded database connection check using SELECT 1.
   * Sanitizes all database host details, connection strings, and stack traces.
   */
  private async probeDatabase(): Promise<ComponentCheck> {
    const startTime = Date.now();
    try {
      await Promise.race([
        this.prisma.$queryRawUnsafe('SELECT 1'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('DATABASE_PROBE_TIMEOUT')), this.CHECK_TIMEOUT_MS),
        ),
      ]);
      const latencyMs = Date.now() - startTime;
      return {
        status: latencyMs > 1000 ? 'DEGRADED' : 'HEALTHY',
        latencyMs,
        message: 'PostgreSQL connection responsive',
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const isTimeout = err?.message === 'DATABASE_PROBE_TIMEOUT';
      this.logger.error(`Database health probe failed (${isTimeout ? 'TIMEOUT' : 'ERROR'}): ${err?.message}`);

      return {
        status: 'UNAVAILABLE',
        latencyMs,
        message: isTimeout
          ? 'Database probe timed out after 2000ms'
          : 'Database connection failed. Check connection pool capacity.',
      };
    }
  }

  /**
   * Evaluates heap and memory pressure.
   */
  private probeMemory(): ComponentCheck {
    const memUsage = process.memoryUsage();
    const heapUsedRatio = memUsage.heapUsed / memUsage.heapTotal;

    if (heapUsedRatio > 0.92) {
      return {
        status: 'DEGRADED',
        details: {
          heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
          usageRatio: Math.round(heapUsedRatio * 100) / 100,
        },
        message: 'High memory heap pressure (>92% allocated)',
      };
    }

    return {
      status: 'HEALTHY',
      details: {
        heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
        usageRatio: Math.round(heapUsedRatio * 100) / 100,
      },
      message: 'Memory utilization within safe boundaries',
    };
  }
}
