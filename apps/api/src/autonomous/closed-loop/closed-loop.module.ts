import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FeatureEngineeringModule } from '../../modules/feature-engineering/feature-engineering.module';
import { QueueModule } from '../../modules/queue/queue.module';

import { ClosedLoopController } from './closed-loop.controller';
import { ActionExecutorService } from './action-executor.service';
import { ClosedLoopOrchestratorService } from './closed-loop-orchestrator.service';
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
import { AutonomySafetyService } from './autonomy-safety.service';
import { KillSwitchService } from './kill-switch.service';

@Module({
  imports: [PrismaModule, FeatureEngineeringModule, QueueModule],
  controllers: [ClosedLoopController],
  providers: [
    ActionExecutorService,
    ClosedLoopOrchestratorService,
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
  ],
  exports: [
    ActionExecutorService,
    ClosedLoopOrchestratorService,
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
  ],
})
export class ClosedLoopModule {}
