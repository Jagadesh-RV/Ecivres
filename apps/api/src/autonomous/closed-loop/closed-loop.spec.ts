import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FeatureEngineeringService } from '../../modules/feature-engineering/services/feature-engineering.service';
import { ProductionQueueService } from '../../modules/queue/production-queue.service';

import { ActionExecutorService } from './action-executor.service';
import { ActionCatalogService } from './action-catalog.service';
import { ExecutionValidationService } from './execution-validation.service';
import { ExecutionCompensationService } from './execution-compensation.service';
import { DecisionExecutionService } from './decision-execution.service';
import { OutcomeMeasurementService } from './outcome-measurement.service';
import { DecisionEffectivenessService } from './decision-effectiveness.service';
import { ImpactAnalysisService } from './impact-analysis.service';
import { DigitalTwinService } from './digital-twin.service';
import { ExperimentationService } from './experimentation.service';
import { OptimizationEngineService } from './optimization-engine.service';
import { AgentPerformanceService } from './agent-performance.service';
import { PolicyOptimizationService } from './policy-optimization.service';
import { SelfHealingService } from './self-healing.service';
import { DriftDetectionService } from './drift-detection.service';
import { GovernanceService } from './governance.service';
import { AutonomySafetyService, AutonomyLevel } from './autonomy-safety.service';
import { KillSwitchService } from './kill-switch.service';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
import { ClosedLoopController } from './closed-loop.controller';
import { ExecuteActionDto } from './dto/execute-action.dto';

describe('ClosedLoopModule (Phase 18 Master Test Suite)', () => {
  let controller: ClosedLoopController;
  let actionCatalog: ActionCatalogService;
  let validationService: ExecutionValidationService;
  let compensationService: ExecutionCompensationService;
  let decisionExecution: DecisionExecutionService;
  let outcomeMeasurement: OutcomeMeasurementService;
  let decisionEffectiveness: DecisionEffectivenessService;
  let impactAnalysis: ImpactAnalysisService;
  let digitalTwin: DigitalTwinService;
  let experimentation: ExperimentationService;
  let optimizationEngine: OptimizationEngineService;
  let agentPerformance: AgentPerformanceService;
  let policyOptimization: PolicyOptimizationService;
  let selfHealing: SelfHealingService;
  let driftDetection: DriftDetectionService;
  let governance: GovernanceService;
  let autonomySafety: AutonomySafetyService;
  let killSwitch: KillSwitchService;
  let orchestrator: ClosedLoopOrchestratorService;

  const mockPrismaService = {
    closedLoopExecution: {
      create: jest.fn().mockResolvedValue({ id: 'exec_1' }),
      update: jest.fn().mockResolvedValue({ id: 'exec_1' }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    actionCatalogRecord: {
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    decisionOutcomeRecord: {
      create: jest.fn().mockResolvedValue({ id: 'out_1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    decisionEffectivenessLog: {
      create: jest.fn().mockResolvedValue({ id: 'eff_1' }),
    },
    experimentationRecord: {
      create: jest.fn().mockResolvedValue({ id: 'exp_1' }),
      update: jest.fn().mockResolvedValue({ id: 'exp_1' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    optimizationRunLog: {
      create: jest.fn().mockResolvedValue({ id: 'opt_1' }),
    },
    agentLearningFeedback: {
      create: jest.fn().mockResolvedValue({ id: 'fb_1' }),
    },
    driftDetectionRecord: {
      create: jest.fn().mockResolvedValue({ id: 'drift_1' }),
    },
    governanceLifecycleRecord: {
      create: jest.fn().mockResolvedValue({ id: 'gov_1' }),
    },
    killSwitchLog: {
      create: jest.fn().mockResolvedValue({ id: 'kill_1' }),
    },
  };

  const mockFeatureEngineeringService = {
    extractMarketplaceFeatures: jest.fn().mockResolvedValue({
      correlationId: 'corr_test',
      timestamp: new Date().toISOString(),
      region: 'GLOBAL',
      demand: { bookingsCount: 300, bookingsPerHour: 12, bookingAccelerationPct: 5.2, categoryGrowthPct: 8.1, geographicDemandDensity: 42, cancellationRatePct: 3.1 },
      supply: { activeProvidersCount: 340, providerUtilizationPct: 65.0 },
      financial: { gmvAmount: 150000, averageOrderValue: 85, takeRatePct: 15.0, refundRatePct: 1.2, payoutVolumeAmount: 127500 },
      operational: { apiLatencyMs: 38, paymentFailureRatePct: 0.5, anomalyCount: 0 },
      overallMarketRiskScore: 18,
    }),
  };

  const mockQueueService = {
    getQueueMetrics: jest.fn().mockResolvedValue({ status: 'HEALTHY', totalQueued: 0, dlqCount: 0 }),
    getDlqJobs: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosedLoopController],
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: FeatureEngineeringService, useValue: mockFeatureEngineeringService },
        { provide: ProductionQueueService, useValue: mockQueueService },
        ActionExecutorService,
        ActionCatalogService,
        ExecutionValidationService,
        ExecutionCompensationService,
        DecisionExecutionService,
        OutcomeMeasurementService,
        DecisionEffectivenessService,
        ImpactAnalysisService,
        DigitalTwinService,
        ExperimentationService,
        OptimizationEngineService,
        AgentPerformanceService,
        PolicyOptimizationService,
        SelfHealingService,
        DriftDetectionService,
        GovernanceService,
        AutonomySafetyService,
        KillSwitchService,
        ClosedLoopOrchestratorService,
      ],
    }).compile();

    controller = module.get<ClosedLoopController>(ClosedLoopController);
    actionCatalog = module.get<ActionCatalogService>(ActionCatalogService);
    validationService = module.get<ExecutionValidationService>(ExecutionValidationService);
    compensationService = module.get<ExecutionCompensationService>(ExecutionCompensationService);
    decisionExecution = module.get<DecisionExecutionService>(DecisionExecutionService);
    outcomeMeasurement = module.get<OutcomeMeasurementService>(OutcomeMeasurementService);
    decisionEffectiveness = module.get<DecisionEffectivenessService>(DecisionEffectivenessService);
    impactAnalysis = module.get<ImpactAnalysisService>(ImpactAnalysisService);
    digitalTwin = module.get<DigitalTwinService>(DigitalTwinService);
    experimentation = module.get<ExperimentationService>(ExperimentationService);
    optimizationEngine = module.get<OptimizationEngineService>(OptimizationEngineService);
    agentPerformance = module.get<AgentPerformanceService>(AgentPerformanceService);
    policyOptimization = module.get<PolicyOptimizationService>(PolicyOptimizationService);
    selfHealing = module.get<SelfHealingService>(SelfHealingService);
    driftDetection = module.get<DriftDetectionService>(DriftDetectionService);
    governance = module.get<GovernanceService>(GovernanceService);
    autonomySafety = module.get<AutonomySafetyService>(AutonomySafetyService);
    killSwitch = module.get<KillSwitchService>(KillSwitchService);
    orchestrator = module.get<ClosedLoopOrchestratorService>(ClosedLoopOrchestratorService);
  });

  // ==========================================
  // WAVE 1: DECISION EXECUTION & WAVE 3: IDEMPOTENCY
  // ==========================================
  describe('WAVE 1 & 3: Decision Execution & Idempotency', () => {
    it('should execute a valid decision action successfully', async () => {
      const dto: ExecuteActionDto = {
        decisionId: 'dec_101',
        actionType: 'MARKETPLACE_PROMOTION_ADJUST',
        idempotencyKey: 'idemp_key_101',
        targetEntity: 'CAMPAIGN_REGIONAL',
        payload: { campaignId: 'cmp_1', discountPercentageDelta: 5.0, budgetCap: 1500 },
      };

      const result = await decisionExecution.executeDecisionAction(dto);
      expect(result.id).toBeDefined();
      expect(result.status).toBe('EXECUTED');
      expect(result.actionType).toBe('MARKETPLACE_PROMOTION_ADJUST');
      expect(result.payload.executionEffect).toBe('APPLIED');
    });

    it('should block duplicate execution with 409 ConflictException', async () => {
      const dto: ExecuteActionDto = {
        decisionId: 'dec_102',
        actionType: 'MARKETPLACE_PROMOTION_ADJUST',
        idempotencyKey: 'idemp_dup_102',
        targetEntity: 'CAMPAIGN_REGIONAL',
        payload: { budgetCap: 1000 },
      };

      await decisionExecution.executeDecisionAction(dto);
      await expect(decisionExecution.executeDecisionAction(dto)).rejects.toThrow(ConflictException);
    });

    it('should compensate an executed decision when requested', async () => {
      const dto: ExecuteActionDto = {
        decisionId: 'dec_103',
        actionType: 'MARKETPLACE_PROMOTION_ADJUST',
        idempotencyKey: 'idemp_comp_103',
        targetEntity: 'CAMPAIGN_REGIONAL',
        payload: { discountPercentageDelta: 10.0 },
      };

      const exec = await decisionExecution.executeDecisionAction(dto);
      const comp = await decisionExecution.compensateDecision(exec.id, 'Downstream step aborted');
      expect(comp.status).toBe('COMPENSATED');
      expect(comp.executionId).toBe(exec.id);

      const updated = await decisionExecution.getExecution(exec.id);
      expect(updated?.status).toBe('COMPENSATED');
    });
  });

  // ==========================================
  // WAVE 2: ACTION CATALOG & LIMITS
  // ==========================================
  describe('WAVE 2: Governed Action Catalog', () => {
    it('should enforce monetary limits on registered actions', () => {
      // Max for MARKETPLACE_PROMOTION_ADJUST is $5,000
      expect(() => actionCatalog.validateMonetaryLimit('MARKETPLACE_PROMOTION_ADJUST', 2500)).not.toThrow();
      expect(() => actionCatalog.validateMonetaryLimit('MARKETPLACE_PROMOTION_ADJUST', 9000)).toThrow(BadRequestException);
    });

    it('should correctly flag actions requiring human approval', () => {
      expect(actionCatalog.requiresApproval('PRICING_DYNAMIC_SURGE', 20)).toBe(true); // HIGH risk
      expect(actionCatalog.requiresApproval('OPERATIONAL_REMEDIATION_RETRY', 0)).toBe(false); // LOW risk
    });
  });

  // ==========================================
  // WAVE 4, 5, 6: OUTCOME, EFFECTIVENESS, IMPACT
  // ==========================================
  describe('WAVE 4, 5, 6: Outcome Measurement, Effectiveness, and Impact', () => {
    it('should calculate accurate deltas and percentages', async () => {
      const res = await outcomeMeasurement.measureOutcome({
        decisionId: 'dec_measure',
        executionId: 'exec_measure',
        metricName: 'BOOKING_CONVERSION',
        expectedValue: 20.0,
        actualValue: 24.0,
      });

      expect(res.deltaValue).toBe(4.0);
      expect(res.deltaPercentage).toBe(20.0);
      expect(res.attributionMethod).toBe('OBSERVED');
    });

    it('should decouple technical execution success from business effectiveness', async () => {
      // Setup outcome with severe miss
      await outcomeMeasurement.measureOutcome({
        decisionId: 'dec_ineffective',
        executionId: 'exec_ineffective',
        metricName: 'GMV',
        expectedValue: 50000,
        actualValue: 35000, // -30% miss
      });

      const report = await decisionEffectiveness.evaluateDecisionEffectiveness({
        decisionId: 'dec_ineffective',
        executionId: 'exec_ineffective',
        executionStatus: 'SUCCESS', // Technical execution was successful!
      });

      expect(report.executionStatus).toBe('SUCCESS');
      expect(report.businessEffectiveness).toBe('INEFFECTIVE');
      expect(report.repeatStrategyRecommendation).toBe(false);
    });

    it('should compute statistical significance and confidence intervals in impact analysis', () => {
      const baseline = {
        metricName: 'GMV',
        baselineValue: 100000,
        timeWindow: '7d',
        region: 'GLOBAL',
        historicalMean: 98000,
        forecastExpectation: 101000,
      };

      const analysis = impactAnalysis.compareAgainstBaseline('int_01', baseline, 115000, 100000);
      expect(analysis.absoluteDelta).toBe(15000);
      expect(analysis.incrementalLiftPct).toBe(15.0);
      expect(analysis.isStatisticallySignificant).toBe(true);
      expect(analysis.attributionMethod).toBe('ATTRIBUTED');
    });
  });

  // ==========================================
  // WAVE 7: MARKETPLACE DIGITAL TWIN (READ-ONLY)
  // ==========================================
  describe('WAVE 7: Marketplace Digital Twin', () => {
    it('should simulate counterfactual scenarios in read-only mode without mutating state', async () => {
      const scenarios = [
        {
          scenarioName: 'Scenario A (Baseline)',
          surgePriceMultiplier: 1.0,
          providerIncentiveBonusPct: 0,
          promotionDiscountPct: 0,
          takeRatePct: 15.0,
        },
        {
          scenarioName: 'Scenario B (Surge + Incentive)',
          surgePriceMultiplier: 1.15,
          providerIncentiveBonusPct: 10,
          promotionDiscountPct: 5,
          takeRatePct: 15.0,
        },
      ];

      const report = await digitalTwin.simulateScenarios(scenarios);
      expect(report.isReadOnly).toBe(true);
      expect(report.scenarios.length).toBe(2);
      expect(report.scenarios[1].projectedGmv).toBeGreaterThan(0);
      expect(report.optimalScenarioRecommendation).toBeDefined();
    });
  });

  // ==========================================
  // WAVE 8: AUTONOMOUS EXPERIMENTATION & GUARDRAILS
  // ==========================================
  describe('WAVE 8: Governed Autonomous Experimentation', () => {
    it('should create and launch an experiment', async () => {
      const exp = await experimentation.createExperiment({
        name: 'Dynamic Pricing Elasticity Test',
        description: 'Test surge threshold +10% vs control',
        hypothesis: 'Surge improves provider utilization without lowering GMV',
        objectiveMetric: 'PROVIDER_UTILIZATION',
        controlVariant: { surge: 1.0 },
        testVariants: [{ surge: 1.1 }],
        trafficSplit: { control: 50, test: 50 },
        errorGuardrailThreshold: 0.05,
      });

      expect(exp.status).toBe('DRAFT');
      const launched = await experimentation.launchExperiment(exp.id);
      expect(launched.status).toBe('RUNNING');
    });

    it('should immediately terminate experiment when error rate guardrail is breached (>5%)', async () => {
      const exp = await experimentation.createExperiment({
        name: 'Risky Algorithm Experiment',
        description: 'Testing high risk algorithm',
        hypothesis: 'Test',
        objectiveMetric: 'CONVERSION',
        controlVariant: { v: 1 },
        testVariants: [{ v: 2 }],
        trafficSplit: { control: 50, test: 50 },
        errorGuardrailThreshold: 0.05,
      });
      await experimentation.launchExperiment(exp.id);

      const guardrailResult = await experimentation.evaluateGuardrails(exp.id, {
        currentErrorRate: 0.08, // 8% error rate breaches 5% cap!
        conversionDropPct: 5.0,
        fraudIndicatorCount: 0,
      });

      expect(guardrailResult.healthy).toBe(false);
      expect(guardrailResult.status).toBe('TERMINATED');
      expect(guardrailResult.reason).toContain('Error rate 8.0% exceeded threshold 5.0%');
    });
  });

  // ==========================================
  // WAVE 9: CONTINUOUS MULTI-OBJECTIVE OPTIMIZATION
  // ==========================================
  describe('WAVE 9: Continuous Optimization Engine', () => {
    it('should balance multi-objective optimization with fairness constraints', async () => {
      const result = await optimizationEngine.runOptimization('BALANCED_EQUILIBRIUM', 200000, {
        maxSurgeMultiplier: 1.20,
        maxProviderChurnPct: 2.5,
        maxRefundRatePct: 1.8,
        minProviderRetentionPct: 88.0,
        budgetSubsidyCap: 15000,
      });

      expect(result.status).toBe('COMPLETED');
      expect(result.improvementPercentage).toBeGreaterThan(0);
      expect(result.fairnessScore).toBeGreaterThanOrEqual(70);
      expect(result.multiObjectiveCompositeScore).toBeDefined();
    });
  });

  // ==========================================
  // WAVE 10 & 13: AGENT PERFORMANCE & LEARNING SIGNALS
  // ==========================================
  describe('WAVE 10 & 13: Agent Performance & Closed-Loop Learning', () => {
    it('should record learning feedback signals and compute calibration metrics without self-modifying code', async () => {
      const signal = await agentPerformance.recordLearningFeedback({
        agentId: 'pricing-agent-v1',
        decisionId: 'dec_learn_1',
        feedbackType: 'POSITIVE',
        accuracyScore: 92.5,
        falsePositive: false,
        falseNegative: false,
        impactScore: 1200,
        learningRecommendation: 'Reinforce current elasticity curve parameters',
      });

      expect(signal.recordedAt).toBeDefined();
      const metrics = agentPerformance.getAgentPerformance('pricing-agent-v1');
      expect(metrics.status).toBe('OPTIMAL');
      expect(metrics.calibrationScore).toBeGreaterThan(0.8);
    });
  });

  // ==========================================
  // WAVE 11: POLICY OPTIMIZATION
  // ==========================================
  describe('WAVE 11: Policy Optimization', () => {
    it('should identify overly restrictive policy guardrails with high false rejection rates', () => {
      const analysis = policyOptimization.analyzePolicyEffectiveness('pol_max_surge', 'Max Surge Guardrail', {
        total: 100,
        blocked: 35,
        falseRejections: 22, // 22% false rejections!
        breaches: 0,
      });

      expect(analysis.status).toBe('OVERLY_RESTRICTIVE');
      expect(analysis.recommendedAction).toContain('Recommend relaxing threshold');
    });
  });

  // ==========================================
  // WAVE 12: CONTROLLED SELF-HEALING OPERATIONS
  // ==========================================
  describe('WAVE 12: Self-Healing Operations', () => {
    it('should auto-remediate low-risk dead letter queue anomalies', async () => {
      const plan = await selfHealing.processIncident({
        incidentId: 'inc_dlq_01',
        anomalyType: 'DEAD_LETTER_QUEUE',
        targetResource: 'booking_event_queue',
        severity: 'LOW',
        metadata: { failedJobs: 3 },
      });

      expect(plan.isAutomated).toBe(true);
      expect(plan.status).toBe('RESOLVED');
    });

    it('should block autonomous attempts to modify authentication or security infrastructure', async () => {
      await expect(
        selfHealing.processIncident({
          incidentId: 'inc_auth_hack',
          anomalyType: 'AUTHENTICATION_ALTERATION',
          targetResource: 'auth_jwt_service',
          severity: 'CRITICAL',
          metadata: {},
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ==========================================
  // WAVE 14: DRIFT DETECTION
  // ==========================================
  describe('WAVE 14: Drift Detection', () => {
    it('should detect critical regime shift and recommend governed recalibration', async () => {
      const drift = await driftDetection.evaluateFeatureDrift(
        'SEARCH_TO_BOOK_RATIO',
        'customer_propensity',
        100,
        145, // 45% shift
        0.15,
      );

      expect(drift.isDriftDetected).toBe(true);
      expect(drift.severity).toBe('CRITICAL_DRIFT');
      expect(drift.recommendation).toContain('Recommend initiating governed model retrain');
    });
  });

  // ==========================================
  // WAVE 15, 16, 17: GOVERNANCE, AUTONOMY, KILL SWITCH
  // ==========================================
  describe('WAVE 15, 16, 17: Governance, Autonomy Levels, and Emergency Kill Switches', () => {
    it('should enforce lifecycle transitions under Governance 2.0', async () => {
      const record = await governance.transitionState({
        entityType: 'POLICY',
        entityId: 'pol_discount_cap',
        targetState: 'EVALUATING',
        reason: 'Testing in sandbox environment',
        actorId: 'admin_usr_1',
      });

      expect(record.currentState).toBe('EVALUATING');
      expect(governance.getEntityState('POLICY', 'pol_discount_cap')).toBe('EVALUATING');
    });

    it('should enforce prohibited dangerous operations in AutonomySafetyService', () => {
      expect(() => autonomySafety.assertActionAllowed('DELETE_USER_DATA', {})).toThrow(ForbiddenException);
      expect(() => autonomySafety.assertActionAllowed('DISABLE_FRAUD_CHECKS', {})).toThrow(ForbiddenException);
      expect(() => autonomySafety.assertActionAllowed('MARKETPLACE_PROMOTION_ADJUST', { amount: 1500 })).not.toThrow();
    });

    it('should halt execution when global kill switch is triggered', async () => {
      await killSwitch.activateKillSwitch({
        scope: 'GLOBAL',
        reason: 'Market volatility emergency trigger',
        triggeredBy: 'CHIEF_RISK_OFFICER',
      });

      expect(() => killSwitch.assertExecutionAllowed()).toThrow(ForbiddenException);

      await killSwitch.deactivateKillSwitch('GLOBAL');
      expect(() => killSwitch.assertExecutionAllowed()).not.toThrow();
    });
  });

  // ==========================================
  // FULL CLOSED-LOOP ORCHESTRATION PIPELINE
  // ==========================================
  describe('FULL CLOSED-LOOP PIPELINE INTEGRATION', () => {
    it('should execute complete loop: Decision -> Execution -> Outcome -> Evaluation -> Learning -> Optimization', async () => {
      const actions: ExecuteActionDto[] = [
        {
          decisionId: 'dec_pipeline_999',
          actionType: 'MARKETPLACE_PROMOTION_ADJUST',
          idempotencyKey: 'idemp_pipe_999',
          targetEntity: 'REGIONAL_MARKETPLACE',
          payload: { campaignId: 'cmp_spring', discountPercentageDelta: 5.0, budgetCap: 2000 },
        },
      ];

      const pipeline = await orchestrator.runFullClosedLoop(
        'dec_pipeline_999',
        actions,
        'pricing-agent-01',
        25000,
        27500, // +10% actual performance
      );

      expect(pipeline.decisionId).toBe('dec_pipeline_999');
      expect(pipeline.closedLoopStatus).toBe('COMPLETED');
      expect(pipeline.executionResults.length).toBe(1);
      expect(pipeline.outcomeMeasurement?.deltaPercentage).toBe(10.0);
      expect(pipeline.effectivenessReport?.businessEffectiveness).toBe('SUCCESSFUL');
      expect(pipeline.learningSignal?.feedbackType).toBe('POSITIVE');
      expect(pipeline.optimizationResult?.status).toBe('COMPLETED');
    });
  });
});
