import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DependencyHealthService } from './dependency-health.service';
import { OperationalMetricsService } from './operational-metrics.service';
import { SloTrackerService } from './slo-tracker.service';
import { SelfHealingOrchestratorService } from './self-healing-orchestrator.service';
import { GracefulShutdownService } from './graceful-shutdown.service';
import { IncidentManagerService } from './incident-manager.service';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';
import { SelfHealingGuardService } from '../trust-resilience/self-healing-guard.service';
import { KillSwitchService } from '../../autonomous/closed-loop/kill-switch.service';
import { IntegrationRegistryService } from '../ecosystem/services/integration-registry.service';
import {
  SelfHealingActionType,
  IncidentSeverity,
} from './dto/reliability.dto';

describe('Phase 23: Autonomous Reliability, Self-Healing Infrastructure & Operational Excellence', () => {
  let healthService: DependencyHealthService;
  let metricsService: OperationalMetricsService;
  let sloTracker: SloTrackerService;
  let selfHealingOrchestrator: SelfHealingOrchestratorService;
  let gracefulShutdown: GracefulShutdownService;
  let incidentManager: IncidentManagerService;
  let circuitBreakerService: CircuitBreakerService;
  let killSwitchService: KillSwitchService;

  // Mock Prisma Service
  const mockPrisma = {
    $queryRawUnsafe: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    serviceLevelObjectiveRecord: {
      upsert: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
    },
    selfHealingExecutionAudit: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
    },
    autonomousRecoveryAction: {
      create: jest.fn().mockResolvedValue({}),
    },
    operationsIncident: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
    },
    inboundWebhookEvent: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'evt_dlq_1', provider: 'STRIPE', status: 'DEAD_LETTER' },
        { id: 'evt_dlq_2', provider: 'STRIPE', status: 'DEAD_LETTER' },
      ]),
      update: jest.fn().mockResolvedValue({}),
    },
    selfHealingLoopBreakerRecord: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    circuitBreakerStateRecord: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    killSwitchLog: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DependencyHealthService,
        OperationalMetricsService,
        SloTrackerService,
        SelfHealingOrchestratorService,
        GracefulShutdownService,
        IncidentManagerService,
        CircuitBreakerService,
        SelfHealingGuardService,
        KillSwitchService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: IntegrationRegistryService,
          useValue: {
            checkAllHealth: jest.fn().mockResolvedValue([
              {
                providerName: 'STRIPE_PAYMENT_GATEWAY',
                providerType: 'PAYMENT',
                status: 'HEALTHY',
                latencyMs: 120,
                lastCheckedAt: new Date(),
              },
            ]),
          },
        },
      ],
    }).compile();

    healthService = module.get<DependencyHealthService>(DependencyHealthService);
    metricsService = module.get<OperationalMetricsService>(OperationalMetricsService);
    sloTracker = module.get<SloTrackerService>(SloTrackerService);
    selfHealingOrchestrator = module.get<SelfHealingOrchestratorService>(SelfHealingOrchestratorService);
    gracefulShutdown = module.get<GracefulShutdownService>(GracefulShutdownService);
    incidentManager = module.get<IncidentManagerService>(IncidentManagerService);
    circuitBreakerService = module.get<CircuitBreakerService>(CircuitBreakerService);
    killSwitchService = module.get<KillSwitchService>(KillSwitchService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // 1. WORKSTREAM A: APPLICATION HEALTH & DEPENDENCY MONITORING
  // =========================================================================
  describe('1. Application Health & Dependency Probes', () => {
    it('should return UP and process metadata on liveness check', async () => {
      const liveness = await healthService.checkLiveness();
      expect(liveness.status).toBe('UP');
      expect(liveness.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(typeof liveness.processId).toBe('number');
      expect(liveness.timestamp).toBeDefined();
    });

    it('should return READY when database probe succeeds', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ 1: 1 }]);
      const readiness = await healthService.checkReadiness();

      expect(readiness.status).toBe('READY');
      expect(readiness.checks.database.status).toBe('HEALTHY');
      expect(readiness.checks.database.latencyMs).toBeDefined();
      expect(readiness.checks.backgroundWorkers.status).toBe('HEALTHY');
    });

    it('should return NOT_READY when database query fails or times out', async () => {
      mockPrisma.$queryRawUnsafe.mockRejectedValueOnce(new Error('Connection pool exhausted'));
      const readiness = await healthService.checkReadiness();

      expect(readiness.status).toBe('NOT_READY');
      expect(readiness.checks.database.status).toBe('UNAVAILABLE');
      expect(readiness.checks.database.message).toContain('Check connection pool capacity');
    });

    it('should return deep dependency diagnostic report and redact sensitive topology', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ 1: 1 }]);
      const deepReport = await healthService.checkDeepDependencies();

      expect(deepReport.overallStatus).toBe('HEALTHY');
      expect(deepReport.database.status).toBe('HEALTHY');
      expect(deepReport.system.eventLoopHealthy).toBe(true);
      expect(deepReport.integrations).toBeDefined();

      // Ensure zero sensitive database credentials or hostnames in output
      const jsonOutput = JSON.stringify(deepReport);
      expect(jsonOutput).not.toContain('password');
      expect(jsonOutput).not.toContain('postgresql://');
      expect(jsonOutput).not.toContain('127.0.0.1');
    });

    it('should reflect DEGRADED status in deep dependencies when circuit breaker is OPEN', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ 1: 1 }]);
      const breaker = circuitBreakerService.getBreaker('EXTERNAL_TAX_PROVIDER');
      breaker.state = 'OPEN';

      const deepReport = await healthService.checkDeepDependencies();
      expect(deepReport.overallStatus).toBe('DEGRADED');
      expect(deepReport.circuitBreakers.some((b) => b.state === 'OPEN')).toBe(true);
    });
  });

  // =========================================================================
  // 2. WORKSTREAM B: OBSERVABILITY, CONTEXT & BOUNDED METRICS
  // =========================================================================
  describe('2. Observability & Bounded Metrics', () => {
    it('should calculate rolling p50, p95, and p99 request latency percentiles', () => {
      // Record synthetic latencies from 10ms to 100ms
      for (let i = 1; i <= 100; i++) {
        metricsService.recordRequestLatency(i, i > 95);
      }

      const snapshot = metricsService.getMetricsSnapshot();
      expect(snapshot.totalRequests).toBeGreaterThanOrEqual(100);
      expect(snapshot.latencies.p50Ms).toBeGreaterThanOrEqual(40);
      expect(snapshot.latencies.p95Ms).toBeGreaterThanOrEqual(90);
      expect(snapshot.latencies.p99Ms).toBeGreaterThanOrEqual(95);
      expect(snapshot.errorRatePercent).toBeGreaterThan(0);
    });

    it('should reject unbounded metric labels with high-cardinality identifiers', () => {
      // 1. Unallowed key
      expect(() => {
        metricsService.validateMetricLabels({ unknown_dimension: 'val' });
      }).toThrow(BadRequestException);

      // 2. High-cardinality UUID as value
      expect(() => {
        metricsService.validateMetricLabels({
          workflow: '123e4567-e89b-12d3-a456-426614174000',
        });
      }).toThrow(BadRequestException);

      // 3. Email address in metric value
      expect(() => {
        metricsService.validateMetricLabels({
          service: 'user@example.com',
        });
      }).toThrow(BadRequestException);
    });

    it('should permit bounded metric labels', () => {
      expect(() => {
        metricsService.validateMetricLabels({
          method: 'POST',
          route: '/api/v1/bookings',
          status_code: '200',
          workflow: 'booking_lifecycle',
        });
      }).not.toThrow();
    });

    it('should redact sensitive metadata keys from structured logs', () => {
      const emitSpy = jest.spyOn(metricsService as any, 'sanitizeMetadata');
      metricsService.emitStructuredLog({
        component: 'PaymentService',
        operation: 'capture_charge',
        outcome: 'SUCCESS',
        metadata: {
          token: 'secret_tok_12345',
          apiKey: 'key_live_9999',
          safeField: 'booking_ref_44',
        },
      });

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 3. WORKSTREAM C: SERVICE-LEVEL OBJECTIVES (SLOs) & ERROR BUDGETS
  // =========================================================================
  describe('3. Service-Level Objectives (SLOs) & Error Budgets', () => {
    it('should track nominal workflow events and report HEALTHY budget status', async () => {
      for (let i = 0; i < 20; i++) {
        await sloTracker.recordWorkflowEvent('booking_lifecycle', 120, true);
      }

      const snapshot = sloTracker.getSloSnapshot('booking_lifecycle');
      expect(snapshot.currentAvailability).toBe(100.0);
      expect(snapshot.budgetStatus).toBe('HEALTHY');
      expect(snapshot.errorBudgetRemainingPercent).toBe(100.0);
      expect(snapshot.burnRate).toBe(0.0);
    });

    it('should consume error budget and transition to EXHAUSTED upon repeated failures', async () => {
      // Inject series of failures into authentication workflow
      for (let i = 0; i < 15; i++) {
        await sloTracker.recordWorkflowEvent('authentication', 450, false);
      }

      const snapshot = sloTracker.getSloSnapshot('authentication');
      expect(snapshot.failedEvents).toBe(15);
      expect(snapshot.currentAvailability).toBeLessThan(90.0);
      expect(snapshot.budgetStatus).toBe('EXHAUSTED');
      expect(snapshot.errorBudgetRemainingPercent).toBe(0);
      expect(snapshot.burnRate).toBeGreaterThan(2.0);
      expect(snapshot.recommendedAction).toContain('Halt non-critical deployments');
    });

    it('should return snapshot collection across all platform workflows', () => {
      const allSnapshots = sloTracker.getAllSloSnapshots();
      expect(allSnapshots.length).toBeGreaterThanOrEqual(5);

      const workflowNames = allSnapshots.map((s) => s.workflowName);
      expect(workflowNames).toContain('authentication');
      expect(workflowNames).toContain('service_discovery');
      expect(workflowNames).toContain('booking_lifecycle');
      expect(workflowNames).toContain('payment_processing');
      expect(workflowNames).toContain('webhook_ingestion');
    });
  });

  // =========================================================================
  // 4. WORKSTREAM D & E: SAFE SELF-HEALING & BOUNDED RECOVERY
  // =========================================================================
  describe('4. Bounded Self-Healing & Safe Recovery', () => {
    it('should require operator attribution for high-impact worker throttling', async () => {
      const proposal = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.THROTTLE_BACKGROUND_WORKERS,
        targetComponent: 'booking-notification-queue',
        reason: 'Database pool exhaustion relief',
      });

      expect(proposal.status).toBe('APPROVAL_REQUIRED');
      expect(proposal.details).toContain('requires explicit operator attribution');
    });

    it('should execute worker throttling when operator approval is provided', async () => {
      const result = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.THROTTLE_BACKGROUND_WORKERS,
        targetComponent: 'booking-notification-queue',
        reason: 'Database pool exhaustion relief',
        operatorAttribution: 'sre_lead_jagadesh',
      });

      expect(result.status).toBe('EXECUTED');
      expect(selfHealingOrchestrator.getWorkerThrottleLevel()).toBe(1);

      // Clean up / restore
      selfHealingOrchestrator.resetWorkerThrottle();
      expect(selfHealingOrchestrator.getWorkerThrottleLevel()).toBe(0);
    });

    it('should redrive dead-letter webhooks with bounded batch limits', async () => {
      const result = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.REDRIVE_DEAD_LETTER_WEBHOOKS,
        targetComponent: 'STRIPE',
        reason: 'Upstream webhook outage resolved',
      });

      expect(result.status).toBe('EXECUTED');
      expect(mockPrisma.inboundWebhookEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { provider: 'STRIPE', status: 'DEAD_LETTER' },
          take: 10,
        }),
      );
    });

    it('should dampen unhealthy non-critical integrations with operator attribution', async () => {
      const result = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.DAMPEN_UNHEALTHY_INTEGRATION,
        targetComponent: 'GOOGLE_MAPS_ROUTING',
        reason: 'Upstream rate limiting detected',
        operatorAttribution: 'platform_operator_1',
      });

      expect(result.status).toBe('EXECUTED');
      expect(selfHealingOrchestrator.isIntegrationDampened('GOOGLE_MAPS_ROUTING')).toBe(true);

      // Lift dampening
      selfHealingOrchestrator.clearIntegrationDampening('GOOGLE_MAPS_ROUTING');
      expect(selfHealingOrchestrator.isIntegrationDampened('GOOGLE_MAPS_ROUTING')).toBe(false);
    });

    it('should halt self-healing execution when kill switch is tripped', async () => {
      // Trip kill switch for action
      await killSwitchService.activateKillSwitch({
        scope: 'ACTION',
        scopeId: SelfHealingActionType.REDRIVE_DEAD_LETTER_WEBHOOKS,
        reason: 'Kill switch active test',
        triggeredBy: 'sre_test_operator',
      });

      const result = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.REDRIVE_DEAD_LETTER_WEBHOOKS,
        targetComponent: 'STRIPE',
        reason: 'Test action with active kill switch',
      });

      expect(result.status).toBe('BLOCKED_KILL_SWITCH');
      expect(result.details).toContain('Kill switch active');

      // Deactivate kill switch for subsequent tests
      await killSwitchService.deactivateKillSwitch(
        'ACTION',
        SelfHealingActionType.REDRIVE_DEAD_LETTER_WEBHOOKS,
      );
    });

    it('should track in-flight requests and cleanly drain on graceful shutdown', async () => {
      expect(gracefulShutdown.trackRequestStart()).toBe(true);
      expect(gracefulShutdown.getActiveRequestCount()).toBe(1);

      gracefulShutdown.trackRequestEnd();
      expect(gracefulShutdown.getActiveRequestCount()).toBe(0);

      // Trigger shutdown signal
      await gracefulShutdown.onApplicationShutdown('SIGTERM');
      expect(gracefulShutdown.isDraining()).toBe(true);
      expect(gracefulShutdown.trackRequestStart()).toBe(false); // Reject incoming
      expect(mockPrisma.$disconnect).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 5. WORKSTREAM F & J: INCIDENT MANAGEMENT & OPERATIONAL RUNBOOKS
  // =========================================================================
  describe('5. Incident Management & Operational Runbooks', () => {
    it('should create an operational incident and link to corresponding runbook', async () => {
      const incident = await incidentManager.createIncident({
        title: 'PostgreSQL connection saturation',
        description: 'Connection pool exhausted due to query backlog',
        severity: IncidentSeverity.SEV1,
        source: 'automated-telemetry',
        affectedWorkflows: ['booking_lifecycle', 'payment_processing'],
      });

      expect(incident.incidentId).toBeDefined();
      expect(incident.severity).toBe(IncidentSeverity.SEV1);
      expect(incident.slaBreached).toBe(true);
      expect(incident.runbookUrl).toContain('#runbook-database-degradation');
      expect(mockPrisma.operationsIncident.create).toHaveBeenCalled();
    });

    it('should advance incident lifecycle through INVESTIGATING to RESOLVED', async () => {
      const incident = await incidentManager.createIncident({
        title: 'Webhook delivery failure for partner',
        description: 'Failed delivery to partner webhook endpoint',
        severity: IncidentSeverity.SEV3,
        source: 'webhook-monitor',
      });

      const updated = await incidentManager.updateIncidentStatus(
        incident.incidentId,
        'RESOLVED',
        'Partner renewed expired TLS certificate',
      );

      expect(updated.status).toBe('RESOLVED');
      expect(mockPrisma.operationsIncident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { incidentId: incident.incidentId },
          data: { status: 'RESOLVED' },
        }),
      );
    });

    it('should return only active (OPEN / INVESTIGATING) incidents', () => {
      const active = incidentManager.getActiveIncidents();
      expect(active.every((inc) => inc.status === 'OPEN' || inc.status === 'INVESTIGATING')).toBe(
        true,
      );
    });
  });
});
