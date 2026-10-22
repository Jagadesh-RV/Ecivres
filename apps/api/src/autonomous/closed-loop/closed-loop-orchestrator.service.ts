import { Injectable, Logger } from '@nestjs/common';
import { ActionExecutorService, ActionExecutionResult } from './action-executor.service';
import { DecisionExecutionService } from './decision-execution.service';
import { OutcomeMeasurementService, OutcomeMeasurementResult } from './outcome-measurement.service';
import { DecisionEffectivenessService, DecisionEffectivenessReport } from './decision-effectiveness.service';
import { AgentPerformanceService, AgentLearningSignal } from './agent-performance.service';
import { OptimizationEngineService, OptimizationResult } from './optimization-engine.service';
import { KillSwitchService } from './kill-switch.service';
import { ExecuteActionDto } from './dto/execute-action.dto';
import { TriggerRemediationDto } from './dto/trigger-remediation.dto';

export interface ClosedLoopPipelineResult {
  decisionId: string;
  executionResults: ActionExecutionResult[];
  outcomeMeasurement?: OutcomeMeasurementResult;
  effectivenessReport?: DecisionEffectivenessReport;
  learningSignal?: AgentLearningSignal;
  optimizationResult?: OptimizationResult;
  closedLoopStatus: 'COMPLETED' | 'PARTIALLY_EXECUTED' | 'HALTED_BY_KILL_SWITCH' | 'FAILED';
  completedAt: Date;
}

export interface DecisionOrchestrationSummary {
  decisionId: string;
  totalActions: number;
  status: 'COMPLETED' | 'REMEDIATED' | 'FAILED';
  results: ActionExecutionResult[];
  orchestratedAt: Date;
}

@Injectable()
export class ClosedLoopOrchestratorService {
  private readonly logger = new Logger(ClosedLoopOrchestratorService.name);
  private readonly decisionSummaries = new Map<string, DecisionOrchestrationSummary>();

  constructor(
    private readonly actionExecutor: ActionExecutorService,
    private readonly decisionExecution: DecisionExecutionService,
    private readonly outcomeMeasurement: OutcomeMeasurementService,
    private readonly decisionEffectiveness: DecisionEffectivenessService,
    private readonly agentPerformance: AgentPerformanceService,
    private readonly optimizationEngine: OptimizationEngineService,
    private readonly killSwitch: KillSwitchService,
  ) {}

  async orchestrateDecision(dtos: ExecuteActionDto[]): Promise<DecisionOrchestrationSummary> {
    if (!dtos || dtos.length === 0) {
      throw new Error('No actions provided for decision orchestration.');
    }

    const decisionId = dtos[0].decisionId;
    this.logger.log(`Starting closed-loop orchestration for decision ID: ${decisionId}`);

    // Assert kill switch is not halting execution
    this.killSwitch.assertExecutionAllowed(dtos[0].tenantId, undefined, dtos[0].actionType);

    const results: ActionExecutionResult[] = [];
    let hasFailure = false;

    for (const dto of dtos) {
      try {
        const res = await this.actionExecutor.executeAction(dto);
        results.push(res);
      } catch (err: any) {
        this.logger.error(`Action failed during orchestration: ${err.message}`);
        hasFailure = true;
        break;
      }
    }

    const summary: DecisionOrchestrationSummary = {
      decisionId,
      totalActions: results.length,
      status: hasFailure ? 'FAILED' : 'COMPLETED',
      results,
      orchestratedAt: new Date(),
    };

    this.decisionSummaries.set(decisionId, summary);
    return summary;
  }

  /**
   * Executes the complete end-to-end Closed Loop:
   * Decision -> Execution -> Outcome -> Evaluation -> Learning -> Optimization
   */
  async runFullClosedLoop(
    decisionId: string,
    actionDtos: ExecuteActionDto[],
    agentId: string = 'pricing-agent-01',
    expectedValue: number = 25000,
    actualValue: number = 26500,
  ): Promise<ClosedLoopPipelineResult> {
    this.logger.log(`Running complete closed-loop pipeline for Decision: ${decisionId}`);

    // 1. Execute Actions
    const orchSummary = await this.orchestrateDecision(actionDtos);
    const executionId = orchSummary.results[0]?.executionId || `exec_${decisionId}`;

    // 2. Measure Real-World Outcome
    const outcome = await this.outcomeMeasurement.measureOutcome({
      decisionId,
      executionId,
      metricName: 'GMV_VELOCITY',
      expectedValue,
      actualValue,
      measurementWindow: '24h',
      attributionMethod: 'OBSERVED',
    });

    // 3. Evaluate Business Effectiveness
    const effectiveness = await this.decisionEffectiveness.evaluateDecisionEffectiveness({
      decisionId,
      executionId,
      executionStatus: orchSummary.status === 'COMPLETED' ? 'SUCCESS' : 'FAILED',
      interventionCost: 500,
      measuredGmvImpact: actualValue - expectedValue,
    });

    // 4. Generate Closed-Loop Learning Feedback Signal
    const learningSignal = await this.agentPerformance.recordLearningFeedback({
      agentId,
      decisionId,
      feedbackType: effectiveness.businessEffectiveness === 'SUCCESSFUL' ? 'POSITIVE' : 'CORRECTION',
      accuracyScore: effectiveness.predictionAccuracyPct,
      falsePositive: effectiveness.businessEffectiveness === 'HARMFUL',
      falseNegative: false,
      impactScore: effectiveness.overallRoi,
      learningRecommendation: effectiveness.repeatStrategyRecommendation
        ? 'Reinforce current parameter weights'
        : 'Recalibrate sensitivity threshold',
    });

    // 5. Trigger Multi-Objective Optimization
    const optimization = await this.optimizationEngine.runOptimization(
      'BALANCED_EQUILIBRIUM',
      actualValue,
      {
        maxSurgeMultiplier: 1.25,
        maxProviderChurnPct: 3.0,
        maxRefundRatePct: 2.0,
        minProviderRetentionPct: 85.0,
        budgetSubsidyCap: 10000,
      },
    );

    const pipelineResult: ClosedLoopPipelineResult = {
      decisionId,
      executionResults: orchSummary.results,
      outcomeMeasurement: outcome,
      effectivenessReport: effectiveness,
      learningSignal,
      optimizationResult: optimization,
      closedLoopStatus: orchSummary.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
      completedAt: new Date(),
    };

    this.logger.log(`Closed-loop pipeline completed for ${decisionId} with status=${pipelineResult.closedLoopStatus}`);
    return pipelineResult;
  }

  async triggerRemediation(dto: TriggerRemediationDto): Promise<ActionExecutionResult> {
    this.logger.log(`Triggering automated remediation for execution ID: ${dto.executionId}`);
    return this.actionExecutor.handleCompensation(dto.executionId, dto.reason);
  }

  async getSummary(decisionId: string): Promise<DecisionOrchestrationSummary | undefined> {
    return this.decisionSummaries.get(decisionId);
  }
}
