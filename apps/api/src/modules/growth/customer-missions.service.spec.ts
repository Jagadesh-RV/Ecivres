import { Test, TestingModule } from '@nestjs/testing';
import { CustomerMissionsService } from './customer-missions.service';

describe('CustomerMissionsService', () => {
  let service: CustomerMissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerMissionsService],
    }).compile();

    service = module.get<CustomerMissionsService>(CustomerMissionsService);
  });

  it('should list active missions for user', async () => {
    const missions = await service.getActiveMissions('u100');
    expect(missions.length).toBe(3);
    expect(missions[0].rewardPoints).toBeGreaterThan(0);
  });

  it('should claim completed mission reward', async () => {
    const result = await service.claimMissionReward('u100', 'm3');
    expect(result.claimed).toBe(true);
    expect(result.pointsAwarded).toBe(300);
  });
});
