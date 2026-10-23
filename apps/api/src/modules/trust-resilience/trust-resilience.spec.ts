import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceTrustService } from './marketplace-trust.service';
import { DecisionExplainabilityService } from './decision-explainability.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { ResilientExecutionService } from './resilient-execution.service';
import { SelfHealingGuardService } from './self-healing-guard.service';
import { TrustResilienceMetricsService } from './trust-resilience-metrics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { KillSwitchService } from '../../autonomous/closed-loop/kill-switch.service';
import { ServiceUnavailableException, ForbiddenException } from '@nestjs/common';

describe('Phase 19: Trust, Resilience & Scale Master Test Suite', () => {
  let trustService: MarketplaceTrustService;
  let explainabilityService: DecisionExplainabilityService;
  let circuitBreakerService: CircuitBreakerService;
  let resilientExecutionService: ResilientExecutionService;
  let selfHealingGuardService: SelfHealingGuardService;
  let metricsService: TrustResilienceMetricsService;
  let killSwitchService: KillSwitchService;

  const mockPrismaService = {
    marketplaceTrustIncident: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      update: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
    decisionExplanationRecord: {
      create: jest.fn().mockImplementation((args) => Promise.resolve(args.data)),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    circuitBreakerStateRecord: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    selfHealingLoopBreakerRecord: {
      upsert: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    killSwitchLog: {
      create: jest.fn().mockResolvedValue({}),
    },
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceTrustService,
        DecisionExplainabilityService,
        CircuitBreakerService,
        ResilientExecutionService,
        SelfHealingGuardService,
        TrustResilienceMetricsService,
        KillSwitchService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    trustService = module.get<MarketplaceTrustService>(MarketplaceTrustService);
    explainabilityService = module.get<DecisionExplainabilityService>(DecisionExplainabilityService);
    circuitBreakerService = module.get<CircuitBreakerService>(CircuitBreakerService);
    resilientExecutionService = module.get<ResilientExecutionService>(ResilientExecutionService);
    selfHealingGuardService = module.get<SelfHealingGuardService>(SelfHealingGuardService);
    metricsService = module.get<TrustResilienceMetricsService>(TrustResilienceMetricsService);
    killSwitchService = module.get<KillSwitchService>(KillSwitchService);
  });

  describe('1. Marketplace Trust & Risk Intelligence', () => {
    it('should detect booking abuse with cancellation burst and route to human review', async () => {
      const result = await trustService.evaluateTrustRisk({
        targetType: 'CUSTOMER',
        targetId: 'cust_abuse_1',
        incidentType: 'BOOKING_ABUSE',
        evidenceSignals: { cancellationCount: 4, bookingVelocityPerHour: 12 },
      });

      expect(result.incidentId).toBeDefined();
      expect(result.severity).toBe('MEDIUM');
      expect(result.requiresHumanReview).toBe(true);
      expect(result.recommendedAction).toBe('FLAG_FOR_REVIEW');
      expect(result.provenance.ruleEngineVersion).toBe('v19.1.0');
    });

    it('should detect review manipulation when abnormal 5-star burst is observed', async () => {
      const result = await trustService.evaluateTrustRisk({
        targetType: 'PROVIDER',
        targetId: 'prov_syndicate_99',
        incidentType: 'REVIEW_MANIPULATION',
        evidenceSignals: { consecutiveFiveStarBursts: 6, textSimilarityRatio: 0.92 },
      });

      expect(result.severity).toBe('HIGH');
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0.9);
      expect(result.requiresHumanReview).toBe(true);
      expect(result.recommendedAction).toBe('HOLD_FOR_OPERATOR');
    });

    it('should detect payment velocity anomalies while preserving minimized data', async () => {
      const result = await trustService.evaluateTrustRisk({
        targetType: 'CUSTOMER',
        targetId: 'cust_velocity_1',
        incidentType: 'PAYMENT_VELOCITY',
        evidenceSignals: { failedAttemptCount: 5, cardTokenCount: 4 },
      });

      expect(result.severity).toBe('CRITICAL');
      expect(result.requiresHumanReview).toBe(true);
      expect(result.recommendedAction).toBe('HOLD_FOR_OPERATOR');
    });

    it('should allow operator to review an incident and record appeal notes', async () => {
      const evalResult = await trustService.evaluateTrustRisk({
        targetType: 'CUSTOMER',
        targetId: 'cust_to_review',
        incidentType: 'BOOKING_ABUSE',
        evidenceSignals: { cancellationCount: 3 },
      });

      const review = await trustService.reviewIncident({
        incidentId: evalResult.incidentId,
        decision: 'CONFIRMED',
        reviewerId: 'admin_security_lead',
        notes: 'Confirmed abusive cancellation pattern in Downtown zone.',
      });

      expect(review.status).toBe('CONFIRMED');
      expect(review.reviewerId).toBe('admin_security_lead');

      const appeal = await trustService.submitAppeal({
        incidentId: evalResult.incidentId,
        appellantId: 'cust_to_review',
        justification: 'Severe storm prevented provider arrival.',
      });

      expect(appeal.status).toBe('APPEAL_PENDING_REVIEW');
    });
  });

  describe('2. Explainable Autonomous Decisions', () => {
    it('should record decision explanation with natural business summary and alternatives', async () => {
      const explanation = await explainabilityService.recordDecisionExplanation({
        decisionId: 'dec_pricing_surge_7',
        initiatingEvent: 'ZONE_LIQUIDITY_DEFICIT',
        affectedResource: 'ZONE_MIDTOWN_PLUMBING',
        policyApplied: 'DYNAMIC_PRICING_GUARDRAIL_V2',
        policyVersion: 'v2.1',
        autonomyLevel: 2,
        confidenceScore: 0.94,
        selectedAction: 'PROVIDER_INCENTIVE_PAYOUT',
        alternativesConsidered: [
          {
            actionType: 'SURGE_PRICE_MULTIPLIER',
            score: 0.72,
            discardReason: 'Surge multiplier violates customer affordability boundary',
          },
        ],
        keyEvidenceSignals: {
          deficitPct: 0.28,
          activeProviders: 3,
          unmetBookings: 14,
          secretApiKey: 'redact-me',
        },
        tradeoffAnalysis: 'Incentivizing standby providers yields +18% supply without raising customer rates.',
      });

      expect(explanation.explanationId).toBeDefined();
      expect(explanation.businessSummary).toContain("Autonomous action 'PROVIDER_INCENTIVE_PAYOUT'");
      expect(explanation.businessSummary).toContain('94% confidence');
      expect(explanation.evidenceSignals.secretApiKey).toBeUndefined(); // redacted
      expect(explanation.decisionRationale.alternativesConsidered).toHaveLength(1);
    });

    it('should retrieve stored explanation by decisionId', async () => {
      await explainabilityService.recordDecisionExplanation({
        decisionId: 'dec_retrieval_test',
        initiatingEvent: 'ZONE_LIQUIDITY_DEFICIT',
        affectedResource: 'ZONE_MIDTOWN_PLUMBING',
        policyApplied: 'DYNAMIC_PRICING_GUARDRAIL_V2',
        policyVersion: 'v2.1',
        autonomyLevel: 2,
        confidenceScore: 0.94,
        selectedAction: 'PROVIDER_INCENTIVE_PAYOUT',
        alternativesConsidered: [],
        keyEvidenceSignals: { deficitPct: 0.28 },
        tradeoffAnalysis: 'Incentivizing standby providers yields +18% supply.',
      });

      const fetched = await explainabilityService.getExplanation('dec_retrieval_test');
      expect(fetched.decisionId).toBe('dec_retrieval_test');
      expect(fetched.technicalDetails.affectedResource).toBe('ZONE_MIDTOWN_PLUMBING');
    });
  });

  describe('3. Operational Resilience & Circuit Breakers', () => {
    it('should execute successfully within timeout on healthy service', async () => {
      const result = await resilientExecutionService.executeWithResilience(
        async () => {
          return { status: 'DISPATCHED' };
        },
        { serviceName: 'NOTIFICATION_SERVICE', timeoutMs: 1000 },
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ status: 'DISPATCHED' });
      expect(result.attempts).toBe(1);
      expect(result.circuitState).toBe('CLOSED');
    });

    it('should retry transient errors with exponential backoff and succeed', async () => {
      let callCount = 0;
      const result = await resilientExecutionService.executeWithResilience(
        async () => {
          callCount++;
          if (callCount < 2) {
            const err: any = new Error('Gateway 503 Service Unavailable');
            err.status = 503;
            throw err;
          }
          return { balance: 450 };
        },
        { serviceName: 'PAYMENT_GATEWAY', maxRetries: 2, initialDelayMs: 20 },
      );

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(2);
      expect(result.data).toEqual({ balance: 450 });
    });

    it('should immediately fail permanent errors without wasting retries', async () => {
      let callCount = 0;
      const result = await resilientExecutionService.executeWithResilience(
        async () => {
          callCount++;
          const err: any = new Error('Invalid booking payload');
          err.status = 400;
          throw err;
        },
        { serviceName: 'BOOKING_SERVICE', maxRetries: 3, initialDelayMs: 10 },
      );

      expect(result.success).toBe(false);
      expect(callCount).toBe(1); // zero retries wasted
      expect(result.error).toContain('Invalid booking payload');
    });

    it('should trip circuit breaker from CLOSED to OPEN after 5 consecutive failures', async () => {
      const service = 'EXTERNAL_SMS_PROVIDER';

      for (let i = 0; i < 5; i++) {
        await resilientExecutionService.executeWithResilience(
          async () => {
            const err: any = new Error('Connection timeout');
            err.status = 504;
            throw err;
          },
          { serviceName: service, maxRetries: 0 },
        );
      }

      const breaker = circuitBreakerService.getBreaker(service);
      expect(breaker.state).toBe('OPEN');
      expect(breaker.failureCount).toBe(5);

      // Verify next execution is blocked by OPEN circuit
      await expect(
        resilientExecutionService.executeWithResilience(
          async () => 'should not run',
          { serviceName: service },
        ),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('should invoke fallback when circuit is OPEN if fallbackFn is provided', async () => {
      const service = 'EXTERNAL_FALLBACK_PROVIDER';
      const breaker = circuitBreakerService.getBreaker(service);
      breaker.state = 'OPEN'; // Force OPEN state

      const result = await resilientExecutionService.executeWithResilience(
        async () => 'primary',
        {
          serviceName: service,
          fallbackFn: async () => ({ fallback: true, mode: 'CACHED' }),
        },
      );

      expect(result.success).toBe(true);
      expect(result.fallbackInvoked).toBe(true);
      expect(result.data).toEqual({ fallback: true, mode: 'CACHED' });
    });

    it('should recover circuit breaker to CLOSED after manual reset', () => {
      const service = 'EXTERNAL_SMS_PROVIDER';
      circuitBreakerService.resetBreaker(service);

      const breaker = circuitBreakerService.getBreaker(service);
      expect(breaker.state).toBe('CLOSED');
      expect(breaker.failureCount).toBe(0);
    });
  });

  describe('4. Self-Healing Safety & Loop Breaker', () => {
    it('should execute low-risk remediation under normal limits', async () => {
      let executed = false;
      const result = await selfHealingGuardService.executeGuardedRemediation(
        {
          remediationKey: 'remed_queue_purge_1',
          actionType: 'RETRY_DLQ_MESSAGES',
          payload: { queue: 'notifications' },
        },
        async () => {
          executed = true;
          return { cleared: 5 };
        },
      );

      expect(result.status).toBe('EXECUTED');
      expect(executed).toBe(true);
    });

    it('should trip loop breaker and block repeated execution when exceeding 5 attempts per hour', async () => {
      const key = 'remed_stuck_worker_loop';

      for (let i = 0; i < 5; i++) {
        await selfHealingGuardService.executeGuardedRemediation(
          {
            remediationKey: key,
            actionType: 'RESTART_WORKER',
            payload: {},
          },
          async () => ({ ok: true }),
        );
      }

      // 6th attempt should be blocked by loop breaker
      const blockedResult = await selfHealingGuardService.executeGuardedRemediation(
        {
          remediationKey: key,
          actionType: 'RESTART_WORKER',
          payload: {},
        },
        async () => ({ ok: true }),
      );

      expect(blockedResult.status).toBe('LOOP_BLOCKED');
      expect(blockedResult.incidentCount).toBe(6);
      expect(blockedResult.details).toContain('Repeated remediation loop detected');
    });

    it('should halt remediation if KillSwitch is active for that action', async () => {
      await killSwitchService.activateKillSwitch({
        scope: 'ACTION',
        scopeId: 'DELETE_STALE_CACHE',
        reason: 'Emergency freeze on cache operations',
        triggeredBy: 'CHIEF_RISK_OFFICER',
      });

      await expect(
        selfHealingGuardService.executeGuardedRemediation(
          {
            remediationKey: 'remed_cache_purge',
            actionType: 'DELETE_STALE_CACHE',
            payload: {},
          },
          async () => ({ ok: true }),
        ),
      ).rejects.toThrow(ForbiddenException);

      // Deactivate for test hygiene
      await killSwitchService.deactivateKillSwitch('ACTION', 'DELETE_STALE_CACHE');
    });
  });

  describe('5. Observability & Bounded Health Signals', () => {
    it('should record bounded metrics without unbounded identifiers', () => {
      metricsService.incrementCounter('trust_incidents_total', { severity: 'HIGH', type: 'BOOKING_ABUSE' });
      metricsService.incrementCounter('trust_incidents_total', { severity: 'HIGH', type: 'BOOKING_ABUSE' });

      const metricsOutput = metricsService.getPrometheusMetrics();
      expect(metricsOutput).toContain('trust_incidents_total{severity="HIGH",type="BOOKING_ABUSE"} 2');
      expect(metricsOutput).not.toContain('cust_'); // no user IDs in metric lines
    });

    it('should compute comprehensive health status exposing liveness and readiness', async () => {
      const health = await metricsService.getSystemHealth();

      expect(health.status).toBe('HEALTHY');
      expect(health.liveness).toBe(true);
      expect(health.readiness).toBe(true);
      expect(health.components.database.healthy).toBe(true);
      expect(health.components.circuitBreakers).toBeDefined();
    });
  });
});
