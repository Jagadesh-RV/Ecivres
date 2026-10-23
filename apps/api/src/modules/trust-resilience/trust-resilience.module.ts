import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClosedLoopModule } from '../../autonomous/closed-loop/closed-loop.module';
import { MarketplaceTrustService } from './marketplace-trust.service';
import { DecisionExplainabilityService } from './decision-explainability.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { ResilientExecutionService } from './resilient-execution.service';
import { SelfHealingGuardService } from './self-healing-guard.service';
import { TrustResilienceMetricsService } from './trust-resilience-metrics.service';
import { TrustResilienceController } from './trust-resilience.controller';

@Module({
  imports: [PrismaModule, ClosedLoopModule],
  controllers: [TrustResilienceController],
  providers: [
    MarketplaceTrustService,
    DecisionExplainabilityService,
    CircuitBreakerService,
    ResilientExecutionService,
    SelfHealingGuardService,
    TrustResilienceMetricsService,
  ],
  exports: [
    MarketplaceTrustService,
    DecisionExplainabilityService,
    CircuitBreakerService,
    ResilientExecutionService,
    SelfHealingGuardService,
    TrustResilienceMetricsService,
  ],
})
export class TrustResilienceModule {}
