import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TrustResilienceModule } from '../trust-resilience/trust-resilience.module';
import { EcosystemModule } from '../ecosystem/ecosystem.module';
import { ClosedLoopModule } from '../../autonomous/closed-loop/closed-loop.module';

import { DependencyHealthService } from './dependency-health.service';
import { OperationalMetricsService } from './operational-metrics.service';
import { SloTrackerService } from './slo-tracker.service';
import { SelfHealingOrchestratorService } from './self-healing-orchestrator.service';
import { GracefulShutdownService } from './graceful-shutdown.service';
import { IncidentManagerService } from './incident-manager.service';
import { CircuitBreakerDrillService } from './circuit-breaker-drill.service';
import { ReliabilityController } from './reliability.controller';

@Module({
  imports: [
    PrismaModule,
    TrustResilienceModule,
    EcosystemModule,
    ClosedLoopModule,
  ],
  controllers: [ReliabilityController],
  providers: [
    DependencyHealthService,
    OperationalMetricsService,
    SloTrackerService,
    SelfHealingOrchestratorService,
    GracefulShutdownService,
    IncidentManagerService,
    CircuitBreakerDrillService,
  ],
  exports: [
    DependencyHealthService,
    OperationalMetricsService,
    SloTrackerService,
    SelfHealingOrchestratorService,
    GracefulShutdownService,
    IncidentManagerService,
    CircuitBreakerDrillService,
  ],
})
export class ReliabilityModule {}

