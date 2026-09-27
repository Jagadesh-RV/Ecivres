import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerMissionService } from './services/customer-mission.service';

describe('CustomerMissionService', () => {
  let service: CustomerMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerMissionService],
    }).compile();

    service = module.get<CustomerMissionService>(CustomerMissionService);
  });

  it('should fetch active daily missions', () => {
    const res = service.getDailyMissions('u_1');
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].rewardPoints).toBeDefined();
  });

  it('should grant $20 streak bonus for 3 consecutive months', () => {
    const res = service.evaluateBookingStreak(3);
    expect(res.isStreakBonusEligible).toBe(true);
    expect(res.streakBonusUsd).toBe(20.0);
  });
});
