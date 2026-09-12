import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyExpansionService } from './loyalty-expansion.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LoyaltyExpansionService', () => {
  let service: LoyaltyExpansionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyExpansionService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<LoyaltyExpansionService>(LoyaltyExpansionService);
  });

  it('should evaluate user loyalty status, tiers, and birthday reward availability', async () => {
    const currentMonth = new Date().getMonth() + 1;
    const status = await service.getLoyaltyStatus('u100', currentMonth);
    expect(status.tier).toBe('PLATINUM');
    expect(status.perks.length).toBeGreaterThan(1);
    expect(status.birthdayRewardAvailable).toBe(true);
  });

  it('should claim birthday reward successfully', async () => {
    const reward = await service.claimBirthdayReward('u100');
    expect(reward.claimed).toBe(true);
    expect(reward.rewardCode).toContain('BDAY-');
    expect(reward.discountAmount).toBe(30);
  });
});
