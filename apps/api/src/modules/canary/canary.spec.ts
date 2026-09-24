import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CanaryMetricsMonitorService } from './services/canary-metrics-monitor.service';

describe('CanaryMetricsMonitorService', () => {
  let service: CanaryMetricsMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanaryMetricsMonitorService],
    }).compile();

    service = module.get<CanaryMetricsMonitorService>(CanaryMetricsMonitorService);
  });

  it('should trigger automatic rollback when error rate exceeds 1.0%', async () => {
    const res = await service.evaluateAutomaticRollback('v8.2.0', 1.5, 300);
    expect(res.triggerRollback).toBe(true);
    expect(res.action).toBe('IMMEDIATE_ROLLBACK_TO_STABLE');
  });

  it('should trigger automatic rollback when P95 latency exceeds 500ms', async () => {
    const res = await service.evaluateAutomaticRollback('v8.2.0', 0.2, 650);
    expect(res.triggerRollback).toBe(true);
  });

  it('should allow rollout to continue when metrics remain within threshold', async () => {
    const res = await service.evaluateAutomaticRollback('v8.2.0', 0.1, 180);
    expect(res.triggerRollback).toBe(false);
    expect(res.action).toBe('CONTINUE_ROLLOUT');
  });
});
