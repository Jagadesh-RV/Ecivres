import { Test, TestingModule } from '@nestjs/testing';
import { DisasterRecoveryService } from './disaster-recovery.service';

describe('DisasterRecoveryService', () => {
  let service: DisasterRecoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisasterRecoveryService],
    }).compile();

    service = module.get<DisasterRecoveryService>(DisasterRecoveryService);
  });

  it('should verify cross-region backup replication status and low lag', async () => {
    const status = await service.checkCrossRegionReplication();
    expect(status.primaryRegion).toBe('us-east-1');
    expect(status.secondaryRegion).toBe('us-west-2');
    expect(status.status).toBe('SYNCHRONIZED');
    expect(status.replicationLagSeconds).toBeLessThan(60);
  });

  it('should validate automated Route 53 DNS failover and RTO/RPO limits', async () => {
    const validation = await service.validateAutomatedFailover();
    expect(validation.validationPassed).toBe(true);
    expect(validation.estimatedRtoMinutes).toBeLessThanOrEqual(5);
    expect(validation.estimatedRpoSeconds).toBeLessThanOrEqual(30);
  });
});
