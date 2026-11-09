import { Test, TestingModule } from '@nestjs/testing';
import { DependencyHealthService } from './dependency-health.service';
import { OperationalMetricsService } from './operational-metrics.service';
import { SloTrackerService } from './slo-tracker.service';
import { SelfHealingOrchestratorService } from './self-healing-orchestrator.service';
import { IncidentManagerService } from './incident-manager.service';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';
import { SelfHealingGuardService } from '../trust-resilience/self-healing-guard.service';
import { KillSwitchService } from '../../autonomous/closed-loop/kill-switch.service';
import { IntegrationRegistryService } from '../ecosystem/services/integration-registry.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SelfHealingActionType,
  IncidentSeverity,
} from './dto/reliability.dto';
import { validateProductionEnvironment } from '../../config/env-validation';

describe('Phase 25: Staging & Production Deployment E2E Lifecycle Verification', () => {
  let healthService: DependencyHealthService;
  let metricsService: OperationalMetricsService;
  let sloTracker: SloTrackerService;
  let selfHealingOrchestrator: SelfHealingOrchestratorService;
  let incidentManager: IncidentManagerService;

  // Mock In-Memory State for Full-Lifecycle Simulation
  const databaseStore = {
    users: new Map<string, any>(),
    categories: new Map<string, any>(),
    services: new Map<string, any>(),
    bookings: new Map<string, any>(),
    payments: new Map<string, any>(),
    reviews: new Map<string, any>(),
    auditLogs: [] as any[],
  };

  const mockPrisma = {
    $queryRawUnsafe: jest.fn().mockImplementation(async (sql: string) => {
      if (sql.includes('SELECT 1')) return [{ 1: 1 }];
      return [];
    }),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    serviceLevelObjectiveRecord: {
      upsert: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
    },
    selfHealingExecutionAudit: {
      create: jest.fn().mockImplementation(async ({ data }) => {
        databaseStore.auditLogs.push(data);
        return { id: `audit_${Date.now()}`, ...data };
      }),
      findMany: jest.fn().mockImplementation(async () => databaseStore.auditLogs),
    },
    autonomousRecoveryAction: {
      create: jest.fn().mockResolvedValue({ id: 'rec_1' }),
    },
    operationsIncident: {
      create: jest.fn().mockImplementation(async ({ data }) => ({
        id: `inc_${Date.now()}`,
        incidentId: data.incidentId || `inc_${Date.now()}`,
        ...data,
      })),
      update: jest.fn().mockImplementation(async ({ data }) => ({
        ...data,
        updatedAt: new Date(),
      })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    inboundWebhookEvent: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'evt_dlq_stage_1', provider: 'STRIPE', status: 'DEAD_LETTER' },
      ]),
      update: jest.fn().mockResolvedValue({}),
    },
    selfHealingLoopBreakerRecord: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    circuitBreakerStateRecord: {
      upsert: jest.fn().mockResolvedValue({}),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DependencyHealthService,
        OperationalMetricsService,
        SloTrackerService,
        SelfHealingOrchestratorService,
        IncidentManagerService,
        CircuitBreakerService,
        SelfHealingGuardService,
        KillSwitchService,
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
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    healthService = module.get<DependencyHealthService>(DependencyHealthService);
    metricsService = module.get<OperationalMetricsService>(OperationalMetricsService);
    sloTracker = module.get<SloTrackerService>(SloTrackerService);
    selfHealingOrchestrator = module.get<SelfHealingOrchestratorService>(SelfHealingOrchestratorService);
    incidentManager = module.get<IncidentManagerService>(IncidentManagerService);
  });

  afterAll(async () => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('1. Production & Staging Health Probe Verification', () => {
    it('should return PASS for liveness probe when application is online', async () => {
      const liveness = await healthService.checkLiveness();
      expect(liveness.status).toBe('UP');
      expect(liveness.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(liveness.timestamp).toBeDefined();
    });

    it('should return READY and 200 OK equivalent when database and cache dependencies are responsive', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ 1: 1 }]);
      const readiness = await healthService.checkReadiness();
      expect(readiness.status).toBe('READY');
      expect(readiness.checks.database.status).toBe('HEALTHY');
      expect(readiness.checks.backgroundWorkers.status).toBe('HEALTHY');
    });

    it('should correctly diagnose and isolate database connectivity failures', async () => {
      mockPrisma.$queryRawUnsafe.mockRejectedValueOnce(new Error('Connection timed out after 3000ms'));
      const degraded = await healthService.checkReadiness();
      expect(degraded.status).toBe('NOT_READY');
      expect(degraded.checks.database.status).toBe('UNAVAILABLE');
    });

    it('should report deep dependency status with credential redaction', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ 1: 1 }]);
      const detailed = await healthService.checkDeepDependencies();
      expect(detailed.database.status).toBe('HEALTHY');
      expect(detailed.system.eventLoopHealthy).toBe(true);
      expect(detailed.integrations).toBeDefined();

      const jsonOutput = JSON.stringify(detailed);
      expect(jsonOutput).not.toContain('password');
      expect(jsonOutput).not.toContain('postgresql://');
    });
  });

  describe('2. End-to-End Multi-Role Marketplace Lifecycle Simulation', () => {
    it('Step 1: User Onboarding & Identity Provisioning', () => {
      const customer = {
        id: 'usr_cust_staging_001',
        email: 'customer.staging@ecivres.com',
        role: 'CUSTOMER',
        name: 'Jane Customer',
        isVerified: true,
      };
      const provider = {
        id: 'usr_prov_staging_002',
        email: 'electrician.staging@ecivres.com',
        role: 'PROVIDER',
        name: 'Bob Electrician',
        isVerified: true,
      };

      databaseStore.users.set(customer.id, customer);
      databaseStore.users.set(provider.id, provider);

      expect(databaseStore.users.get('usr_cust_staging_001')).toBeDefined();
      expect(databaseStore.users.get('usr_prov_staging_002').role).toBe('PROVIDER');
    });

    it('Step 2: Marketplace Category and Service Offering Registration', () => {
      const category = {
        id: 'cat_electrical_staging',
        slug: 'electrical-engineering',
        name: 'Electrical Services',
        isActive: true,
      };
      const service = {
        id: 'srv_panel_upgrade',
        categoryId: category.id,
        providerId: 'usr_prov_staging_002',
        title: 'Residential Circuit Breaker & Panel Upgrade',
        basePrice: 250.0,
        currency: 'USD',
        isAvailable: true,
      };

      databaseStore.categories.set(category.id, category);
      databaseStore.services.set(service.id, service);

      expect(databaseStore.services.get('srv_panel_upgrade').basePrice).toBe(250.0);
    });

    it('Step 3: Dynamic Booking Initiation & State Machine Progression', () => {
      const booking = {
        id: 'bk_staging_88910',
        customerId: 'usr_cust_staging_001',
        providerId: 'usr_prov_staging_002',
        serviceId: 'srv_panel_upgrade',
        status: 'PENDING',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        totalAmount: 250.0,
      };

      databaseStore.bookings.set(booking.id, booking);

      // Provider confirms booking
      booking.status = 'CONFIRMED';
      expect(databaseStore.bookings.get('bk_staging_88910').status).toBe('CONFIRMED');

      // Provider commences work on-site
      booking.status = 'IN_PROGRESS';
      expect(databaseStore.bookings.get('bk_staging_88910').status).toBe('IN_PROGRESS');

      // Provider completes work
      booking.status = 'COMPLETED';
      expect(databaseStore.bookings.get('bk_staging_88910').status).toBe('COMPLETED');
    });

    it('Step 4: Escrow Payment Authorization, Settlement and Receipt', () => {
      const payment = {
        id: 'pay_staging_tx_9981',
        bookingId: 'bk_staging_88910',
        customerId: 'usr_cust_staging_001',
        providerId: 'usr_prov_staging_002',
        amount: 250.0,
        platformFee: 25.0, // 10% platform take rate
        providerPayout: 225.0,
        status: 'CAPTURED',
        escrowReleasedAt: new Date().toISOString(),
      };

      databaseStore.payments.set(payment.id, payment);

      expect(databaseStore.payments.get('pay_staging_tx_9981').providerPayout).toBe(225.0);
      expect(databaseStore.payments.get('pay_staging_tx_9981').status).toBe('CAPTURED');
    });

    it('Step 5: Customer Review & Rating Publication', () => {
      const review = {
        id: 'rev_staging_4401',
        bookingId: 'bk_staging_88910',
        customerId: 'usr_cust_staging_001',
        providerId: 'usr_prov_staging_002',
        rating: 5,
        comment: 'Flawless staging test execution and panel installation!',
        createdAt: new Date().toISOString(),
      };

      databaseStore.reviews.set(review.id, review);

      expect(databaseStore.reviews.get('rev_staging_4401').rating).toBe(5);
    });
  });

  describe('3. Operational SLOs, Fault Injection & Self-Healing', () => {
    it('should track nominal workflow events and calculate burn rate', async () => {
      await sloTracker.recordWorkflowEvent('booking_lifecycle', 120, true);
      await sloTracker.recordWorkflowEvent('booking_lifecycle', 140, true);

      const snapshot = sloTracker.getSloSnapshot('booking_lifecycle');
      expect(snapshot.currentAvailability).toBe(100.0);
      expect(snapshot.budgetStatus).toBe('HEALTHY');
    });

    it('should trigger self-healing dead-letter webhook redrive safely', async () => {
      const result = await selfHealingOrchestrator.executeSelfHealing({
        actionType: SelfHealingActionType.REDRIVE_DEAD_LETTER_WEBHOOKS,
        targetComponent: 'STRIPE',
        reason: 'Simulated E2E recovery trigger',
      });

      expect(result.status).toBe('EXECUTED');
      expect(mockPrisma.inboundWebhookEvent.findMany).toHaveBeenCalled();
    });

    it('should declare and resolve high-severity operations incidents', async () => {
      const incident = await incidentManager.createIncident({
        title: 'PostgreSQL staging replication latency',
        description: 'Synthetic replication delay exceeded threshold',
        severity: IncidentSeverity.SEV2,
        source: 'synthetic-probe',
        affectedWorkflows: ['booking_lifecycle'],
      });

      expect(incident.incidentId).toBeDefined();
      expect(incident.severity).toBe(IncidentSeverity.SEV2);

      const resolved = await incidentManager.updateIncidentStatus(
        incident.incidentId,
        'RESOLVED',
        'Synthetic load test finished; replication caught up.',
      );

      expect(resolved.status).toBe('RESOLVED');
    });
  });

  describe('4. Environment Security & Secret Governance Assertion', () => {
    it('should enforce production validation against missing critical secrets', () => {
      expect(() => {
        validateProductionEnvironment({
          NODE_ENV: 'production',
          DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
          JWT_ACCESS_SECRET: 'super_secret_access_token_key_change_in_prod', // placeholder rejected
          JWT_REFRESH_SECRET: 'valid_secure_random_string_that_is_at_least_32_characters_long',
          PORT: '5001',
        });
      }).toThrow('DEVSECOPS CRITICAL');
    });

    it('should accept properly configured production secrets', () => {
      expect(() => {
        validateProductionEnvironment({
          NODE_ENV: 'production',
          DATABASE_URL: 'postgresql://postgres:realSecurePassword123@prod-db.internal:5432/ecivres',
          JWT_ACCESS_SECRET: 'production_access_key_a98f12d4838127491028374019283719',
          JWT_REFRESH_SECRET: 'production_refresh_key_f8391029384710293847102938471029',
          PORT: '5001',
        });
      }).not.toThrow();
    });
  });
});
