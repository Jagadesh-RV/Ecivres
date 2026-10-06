import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { DistributedLockManagerService } from './services/distributed-lock-manager.service';
import { GatewayCircuitBreakerService } from './services/gateway-circuit-breaker.service';
import { PerformanceScalingMetricsService } from './services/performance-scaling-metrics.service';

describe('ScalingModule Services', () => {
  let lockService: DistributedLockManagerService;
  let breakerService: GatewayCircuitBreakerService;
  let metricsService: PerformanceScalingMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributedLockManagerService, GatewayCircuitBreakerService, PerformanceScalingMetricsService],
    }).compile();

    lockService = module.get<DistributedLockManagerService>(DistributedLockManagerService);
    breakerService = module.get<GatewayCircuitBreakerService>(GatewayCircuitBreakerService);
    metricsService = module.get<PerformanceScalingMetricsService>(PerformanceScalingMetricsService);
  });

  it('should acquire and release distributed resource locks', async () => {
    const lock1 = await lockService.acquireLock('slot_lock_123', 5000);
    expect(lock1).toBe(true);

    const lock2 = await lockService.acquireLock('slot_lock_123', 5000);
    expect(lock2).toBe(false);

    await lockService.releaseLock('slot_lock_123');
    const lock3 = await lockService.acquireLock('slot_lock_123', 5000);
    expect(lock3).toBe(true);
  });

  it('should trip circuit breaker to OPEN when failure threshold is reached', () => {
    expect(breakerService.getCircuitState('stripe-api')).toBe('CLOSED');

    breakerService.recordFailure('stripe-api', 2);
    expect(breakerService.getCircuitState('stripe-api')).toBe('CLOSED');

    breakerService.recordFailure('stripe-api', 2);
    expect(breakerService.getCircuitState('stripe-api')).toBe('OPEN');

    breakerService.recordSuccess('stripe-api');
    expect(breakerService.getCircuitState('stripe-api')).toBe('CLOSED');
  });

  it('should return cluster resilience metrics', () => {
    const metrics = metricsService.getSystemResilienceStatus();
    expect(metrics.throughputRps).toBeGreaterThan(1000);
    expect(metrics.multiRegionFailoverStatus).toBe('HEALTHY');
  });
});
