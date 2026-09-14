import { Test, TestingModule } from '@nestjs/testing';
import { EarningsBoosterService } from './earnings-booster.service';

describe('EarningsBoosterService', () => {
  let service: EarningsBoosterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarningsBoosterService],
    }).compile();

    service = module.get<EarningsBoosterService>(EarningsBoosterService);
  });

  it('should generate monthly earnings recommendations for provider', async () => {
    const res = await service.getEarningsOptimization('prov_100');
    expect(res.potentialEarningsIncreaseMonthly).toBeGreaterThan(0);
    expect(res.recommendedActions.length).toBe(3);
    expect(res.recommendedActions[0].impact).toContain('+$');
  });
});
