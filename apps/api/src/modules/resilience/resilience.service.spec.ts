import { Test, TestingModule } from '@nestjs/testing';
import { ResilienceService } from './resilience.service';

describe('ResilienceService', () => {
  let service: ResilienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResilienceService],
    }).compile();

    service = module.get<ResilienceService>(ResilienceService);
  });

  it('should validate database backup integrity and restoration', async () => {
    const res = await service.validateLatestDatabaseBackup();
    expect(res.restorationTestPassed).toBe(true);
    expect(res.backupSizeBytes).toBeGreaterThan(0);
  });

  it('should execute chaos simulation and verify automatic recovery', async () => {
    const res = await service.runChaosSimulation('LATENCY_INJECTION');
    expect(res.systemRecoveredAutomatically).toBe(true);
    expect(res.circuitBreakerTripped).toBe(true);
  });
});
