import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
import { ActionExecutorService } from './action-executor.service';
import { ActionCatalogService } from './action-catalog.service';
import { DecisionExecutionService } from './decision-execution.service';
import { OutcomeMeasurementService } from './outcome-measurement.service';
import { DecisionEffectivenessService } from './decision-effectiveness.service';
import { DigitalTwinService } from './digital-twin.service';
import { ExperimentationService } from './experimentation.service';
import { OptimizationEngineService } from './optimization-engine.service';
import { AgentPerformanceService } from './agent-performance.service';
import { PolicyOptimizationService } from './policy-optimization.service';
import { SelfHealingService, RemediationIncident } from './self-healing.service';
import { DriftDetectionService } from './drift-detection.service';
import { GovernanceService } from './governance.service';
import { AutonomySafetyService, AutonomyLevel } from './autonomy-safety.service';
import { KillSwitchService } from './kill-switch.service';
import { ExecuteActionDto } from './dto/execute-action.dto';
import { TriggerRemediationDto } from './dto/trigger-remediation.dto';
import {
  MeasureOutcomeDto,
  EvaluateEffectivenessDto,
  DigitalTwinSimulateDto,
  CreateExperimentRequestDto,
  EvaluateGuardrailsDto,
  RunOptimizationDto,
  EvaluateDriftDto,
  GovernanceTransitionRequestDto,
  KillSwitchTriggerRequestDto,
} from './dto/closed-loop-dtos';

@ApiTags('autonomous-closed-loop')
@Controller('autonomous/closed-loop')
export class ClosedLoopController {
  constructor(
    private readonly orchestrator: ClosedLoopOrchestratorService,
    private readonly executor: ActionExecutorService,
    private readonly decisionExecution: DecisionExecutionService,
    private readonly actionCatalog: ActionCatalogService,
    private readonly outcomeMeasurement: OutcomeMeasurementService,
    private readonly decisionEffectiveness: DecisionEffectivenessService,
    private readonly digitalTwin: DigitalTwinService,
    private readonly experimentation: ExperimentationService,
    private readonly optimizationEngine: OptimizationEngineService,
    private readonly agentPerformance: AgentPerformanceService,
    private readonly policyOptimization: PolicyOptimizationService,
    private readonly selfHealing: SelfHealingService,
    private readonly driftDetection: DriftDetectionService,
    private readonly governance: GovernanceService,
    private readonly autonomySafety: AutonomySafetyService,
    private readonly killSwitch: KillSwitchService,
  ) {}

  // ==========================================
  // EXECUTION & ORCHESTRATION
  // ==========================================

  @Post('execute')
  @ApiOperation({ summary: 'Execute an approved autonomous action with idempotency enforcement' })
  async executeAction(@Body() dto: ExecuteActionDto) {
    this.killSwitch.assertExecutionAllowed(dto.tenantId, undefined, dto.actionType);
    this.autonomySafety.assertActionAllowed(dto.actionType, dto.payload);
    const result = await this.decisionExecution.executeDecisionAction(dto);
    return { success: true, data: result };
  }

  @Post('orchestrate')
  @ApiOperation({ summary: 'Orchestrate a multi-action decision plan' })
  async orchestrateDecision(@Body() dtos: ExecuteActionDto[]) {
    const summary = await this.orchestrator.orchestrateDecision(dtos);
    return { success: true, data: summary };
  }

  @Post('pipeline/run')
  @ApiOperation({ summary: 'Run full end-to-end closed loop (Decision -> Execution -> Outcome -> Evaluation -> Learning -> Optimization)' })
  async runFullClosedLoop(
    @Body()
    body: {
      decisionId: string;
      actions: ExecuteActionDto[];
      agentId?: string;
      expectedValue?: number;
      actualValue?: number;
    },
  ) {
    const result = await this.orchestrator.runFullClosedLoop(
      body.decisionId,
      body.actions,
      body.agentId,
      body.expectedValue,
      body.actualValue,
    );
    return { success: true, data: result };
  }

  @Post('remediate')
  @ApiOperation({ summary: 'Trigger compensation or remediation for an executed action' })
  async remediate(@Body() dto: TriggerRemediationDto) {
    const result = await this.orchestrator.triggerRemediation(dto);
    return { success: true, data: result };
  }

  @Get('execution/:id')
  @ApiOperation({ summary: 'Retrieve execution record by execution ID' })
  async getExecution(@Param('id') id: string) {
    const result = await this.decisionExecution.getExecution(id);
    return { success: !!result, data: result };
  }

  @Get('summary/:decisionId')
  @ApiOperation({ summary: 'Get decision orchestration summary' })
  async getSummary(@Param('decisionId') decisionId: string) {
    const summary = await this.orchestrator.getSummary(decisionId);
    return { success: !!summary, data: summary };
  }

  // ==========================================
  // ACTION CATALOG
  // ==========================================

  @Get('catalog/actions')
  @ApiOperation({ summary: 'List all registered actions in the Action Catalog' })
  getAllCatalogActions() {
    return { success: true, data: this.actionCatalog.getAllActions() };
  }

  // ==========================================
  // OUTCOME MEASUREMENT & EFFECTIVENESS
  // ==========================================

  @Post('outcomes/measure')
  @ApiOperation({ summary: 'Record actual outcome measurement for a decision' })
  async measureOutcome(@Body() dto: MeasureOutcomeDto) {
    const result = await this.outcomeMeasurement.measureOutcome(dto);
    return { success: true, data: result };
  }

  @Get('outcomes/:decisionId')
  @ApiOperation({ summary: 'Fetch all outcome measurements for a decision' })
  async getOutcomesByDecision(@Param('decisionId') decisionId: string) {
    const data = await this.outcomeMeasurement.getOutcomesByDecision(decisionId);
    return { success: true, data };
  }

  @Post('effectiveness/evaluate')
  @ApiOperation({ summary: 'Evaluate business effectiveness and ROI of a decision' })
  async evaluateEffectiveness(@Body() dto: EvaluateEffectivenessDto) {
    const report = await this.decisionEffectiveness.evaluateDecisionEffectiveness(dto);
    return { success: true, data: report };
  }

  // ==========================================
  // MARKETPLACE DIGITAL TWIN
  // ==========================================

  @Post('digital-twin/simulate')
  @ApiOperation({ summary: 'Run counterfactual scenario comparison in read-only Digital Twin' })
  async simulateDigitalTwin(@Body() dto: DigitalTwinSimulateDto) {
    const report = await this.digitalTwin.simulateScenarios(dto.scenarios);
    return { success: true, data: report };
  }

  // ==========================================
  // AUTONOMOUS EXPERIMENTATION
  // ==========================================

  @Post('experiments')
  @ApiOperation({ summary: 'Create a governed autonomous experiment' })
  async createExperiment(@Body() dto: CreateExperimentRequestDto) {
    const exp = await this.experimentation.createExperiment(dto);
    return { success: true, data: exp };
  }

  @Post('experiments/:id/launch')
  @ApiOperation({ summary: 'Launch an approved experiment into active execution' })
  async launchExperiment(@Param('id') id: string) {
    const exp = await this.experimentation.launchExperiment(id);
    return { success: true, data: exp };
  }

  @Post('experiments/:id/guardrails')
  @ApiOperation({ summary: 'Evaluate experiment telemetry against guardrails with automated termination' })
  async evaluateExperimentGuardrails(@Param('id') id: string, @Body() dto: EvaluateGuardrailsDto) {
    const result = await this.experimentation.evaluateGuardrails(id, dto);
    return { success: true, data: result };
  }

  @Get('experiments')
  @ApiOperation({ summary: 'List all autonomous experiments' })
  getAllExperiments() {
    return { success: true, data: this.experimentation.getAllExperiments() };
  }

  // ==========================================
  // CONTINUOUS OPTIMIZATION
  // ==========================================

  @Post('optimization/run')
  @ApiOperation({ summary: 'Run constrained multi-objective marketplace optimization' })
  async runOptimization(@Body() dto: RunOptimizationDto) {
    const result = await this.optimizationEngine.runOptimization(dto.objective, dto.initialGmv, dto.constraints);
    return { success: true, data: result };
  }

  // ==========================================
  // AGENT PERFORMANCE & LEARNING
  // ==========================================

  @Get('agents/:agentId/performance')
  @ApiOperation({ summary: 'Fetch agent calibration and performance metrics' })
  getAgentPerformance(@Param('agentId') agentId: string) {
    const metrics = this.agentPerformance.getAgentPerformance(agentId);
    return { success: true, data: metrics };
  }

  // ==========================================
  // DRIFT DETECTION
  // ==========================================

  @Post('drift/evaluate')
  @ApiOperation({ summary: 'Evaluate feature and prediction drift' })
  async evaluateDrift(@Body() dto: EvaluateDriftDto) {
    const record = await this.driftDetection.evaluateFeatureDrift(
      dto.metricName,
      dto.featureName,
      dto.baselineValue,
      dto.currentValue,
      dto.driftThreshold,
    );
    return { success: true, data: record };
  }

  @Get('drift')
  @ApiOperation({ summary: 'List all detected feature and prediction drifts' })
  getAllDrifts() {
    return { success: true, data: this.driftDetection.getAllDriftRecords() };
  }

  // ==========================================
  // GOVERNANCE & AUTONOMY
  // ==========================================

  @Post('governance/transition')
  @ApiOperation({ summary: 'Transition entity lifecycle state under Governance 2.0' })
  async transitionGovernance(@Body() dto: GovernanceTransitionRequestDto) {
    const record = await this.governance.transitionState(dto);
    return { success: true, data: record };
  }

  @Get('autonomy/level')
  @ApiOperation({ summary: 'Get current platform autonomy level (0 to 5)' })
  getAutonomyLevel() {
    const level = this.autonomySafety.getAutonomyLevel();
    return { success: true, data: { level, name: AutonomyLevel[level] } };
  }

  @Post('autonomy/level')
  @ApiOperation({ summary: 'Update platform autonomy level' })
  setAutonomyLevel(@Body() body: { level: number; actorId: string; reason: string }) {
    const updated = this.autonomySafety.setAutonomyLevel(body.level, body.actorId, body.reason);
    return { success: true, data: { level: updated, name: AutonomyLevel[updated] } };
  }

  // ==========================================
  // EMERGENCY KILL SWITCH
  // ==========================================

  @Post('kill-switch/activate')
  @ApiOperation({ summary: 'Activate emergency kill switch (Global, Tenant, Agent, Action, Experiment)' })
  async activateKillSwitch(@Body() dto: KillSwitchTriggerRequestDto) {
    const result = await this.killSwitch.activateKillSwitch(dto);
    return { success: true, data: result };
  }

  @Post('kill-switch/deactivate')
  @ApiOperation({ summary: 'Deactivate kill switch for a given scope' })
  async deactivateKillSwitch(@Body() body: { scope: any; scopeId?: string; actorId?: string }) {
    const result = await this.killSwitch.deactivateKillSwitch(body.scope, body.scopeId, body.actorId);
    return { success: true, data: { deactivated: result } };
  }

  @Get('kill-switch/status')
  @ApiOperation({ summary: 'Check status of all active kill switches' })
  getKillSwitchStatus() {
    return { success: true, data: this.killSwitch.getStatus() };
  }
}
