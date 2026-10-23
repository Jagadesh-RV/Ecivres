import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CircuitBreakerService } from './circuit-breaker.service';

export interface SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  liveness: boolean;
  readiness: boolean;
  timestamp: Date;
  components: {
    database: { healthy: boolean; latencyMs: number };
    circuitBreakers: { total: number; open: number; halfOpen: number; closed: number };
    trustIncidentBacklog: { pendingReviews: number };
    remediationHealth: { loopBreakersTripped: number };
  };
}

export interface MetricSnapshot {
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: Date;
}

@Injectable()
export class TrustResilienceMetricsService {
  private readonly logger = new Logger(TrustResilienceMetricsService.name);
  private readonly metricCounters = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  /**
   * Increments a bounded telemetry counter.
   * Note: Labels must always be bounded categories (e.g. status, errorType, serviceName), never user IDs.
   */
  incrementCounter(name: string, labels: Record<string, string> = {}, delta: number = 1): void {
    const serializedLabels = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    const key = `${name}{${serializedLabels}}`;
    const current = this.metricCounters.get(key) || 0;
    this.metricCounters.set(key, current + delta);
  }

  /**
   * Retrieves Prometheus-formatted bounded metrics.
   */
  getPrometheusMetrics(): string {
    const lines: string[] = ['# HELP ecivres_trust_resilience_metrics Bounded Trust and Resilience metrics'];
    lines.push('# TYPE ecivres_trust_resilience_metrics counter');

    for (const [key, value] of this.metricCounters.entries()) {
      lines.push(`${key} ${value}`);
    }

    // Add circuit breaker gauges
    const breakers = this.circuitBreakerService.getAllBreakerSnapshots();
    for (const b of breakers) {
      lines.push(`circuit_breaker_status{service="${b.serviceName}",state="${b.state}"} 1`);
      lines.push(`circuit_breaker_failures_total{service="${b.serviceName}"} ${b.failureCount}`);
    }

    return lines.join('\n');
  }

  /**
   * Computes comprehensive platform health status for readiness/liveness probes.
   */
  async getSystemHealth(): Promise<SystemHealthStatus> {
    const now = new Date();
    let dbHealthy = false;
    let dbLatencyMs = 0;

    // 1. Database Ping
    const startDb = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
      dbLatencyMs = Date.now() - startDb;
    } catch {
      dbHealthy = false;
      dbLatencyMs = Date.now() - startDb;
    }

    // 2. Circuit Breaker Gauges
    const breakers = this.circuitBreakerService.getAllBreakerSnapshots();
    const openCount = breakers.filter((b) => b.state === 'OPEN').length;
    const halfOpenCount = breakers.filter((b) => b.state === 'HALF_OPEN').length;
    const closedCount = breakers.filter((b) => b.state === 'CLOSED').length;

    // 3. Human Review Backlog
    let pendingReviews = 0;
    try {
      pendingReviews = await this.prisma.marketplaceTrustIncident.count({
        where: { status: 'IN_REVIEW' },
      });
    } catch {
      pendingReviews = 0;
    }

    // 4. Loop Breaker Tripped Count
    let loopBreakersTripped = 0;
    try {
      loopBreakersTripped = await this.prisma.selfHealingLoopBreakerRecord.count({
        where: { status: 'LOOP_BLOCKED' },
      });
    } catch {
      loopBreakersTripped = 0;
    }

    const isLiveness = dbHealthy;
    const isReadiness = dbHealthy && openCount === 0;
    const overallStatus: SystemHealthStatus['status'] =
      !dbHealthy || openCount > 2 ? 'UNHEALTHY' : openCount > 0 ? 'DEGRADED' : 'HEALTHY';

    return {
      status: overallStatus,
      liveness: isLiveness,
      readiness: isReadiness,
      timestamp: now,
      components: {
        database: { healthy: dbHealthy, latencyMs: dbLatencyMs },
        circuitBreakers: {
          total: breakers.length,
          open: openCount,
          halfOpen: halfOpenCount,
          closed: closedCount,
        },
        trustIncidentBacklog: { pendingReviews },
        remediationHealth: { loopBreakersTripped },
      },
    };
  }
}
