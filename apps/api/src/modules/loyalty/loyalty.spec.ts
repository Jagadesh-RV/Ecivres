import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyVipTierService } from './services/loyalty-vip-tier.service';

describe('LoyaltyVipTierService', () => {
  let service: LoyaltyVipTierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyVipTierService],
    }).compile();

    service = module.get<LoyaltyVipTierService>(LoyaltyVipTierService);
  });

  it('should calculate DIAMOND VIP tier for high spenders', () => {
    const res = service.calculateVipTier(6000, 60);
    expect(res.tier).toBe('DIAMOND');
    expect(res.cashbackRatePercent).toBe(10.0);
  });

  it('should calculate PLATINUM VIP tier', () => {
    const res = service.calculateVipTier(2500, 25);
    expect(res.tier).toBe('PLATINUM');
    expect(res.cashbackRatePercent).toBe(7.5);
  });

  it('should calculate GOLD VIP tier', () => {
    const res = service.calculateVipTier(800, 10);
    expect(res.tier).toBe('GOLD');
    expect(res.cashbackRatePercent).toBe(5.0);
  });
});
