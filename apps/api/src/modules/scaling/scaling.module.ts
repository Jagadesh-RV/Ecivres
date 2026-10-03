import { Module } from '@nestjs/common';
import { DistributedLockManagerService } from './services/distributed-lock-manager.service';
import { GatewayCircuitBreakerService } from './services/gateway-circuit-breaker.service';
import { PerformanceScalingMetricsService } from './services/performance-scaling-metrics.service';
import { ScalingController } from './scaling.controller';

@Module({
  controllers: [ScalingController],
  providers: [DistributedLockManagerService, GatewayCircuitBreakerService, PerformanceScalingMetricsService],
  exports: [DistributedLockManagerService, GatewayCircuitBreakerService, PerformanceScalingMetricsService],
})
export class ScalingModule {}
