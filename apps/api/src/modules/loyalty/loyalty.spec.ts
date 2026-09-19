import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyTierService } from './services/loyalty-tier.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LoyaltyTierService', () => {
  let service: LoyaltyTierService;

  const mockPrisma = {
    loyaltyAccount: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyTierService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LoyaltyTierService>(LoyaltyTierService);
  });

  it('should return default BRONZE tier when no account exists', async () => {
    mockPrisma.loyaltyAccount.findUnique.mockResolvedValue(null);
    const res = await service.getUserTier('usr_1');
    expect(res.tier).toBe('BRONZE');
  });

  it('should calculate cashback for GOLD tier accurately', async () => {
    mockPrisma.loyaltyAccount.findUnique.mockResolvedValue({
      userId: 'usr_2',
      tier: 'GOLD',
      points: 500,
      cashbackBalance: 20.0,
    });

    const res = await service.calculateCashback('usr_2', 100);
    expect(res.tier).toBe('GOLD');
    expect(res.cashbackEarned).toBe(8.0);
    expect(res.newBalance).toBe(28.0);
  });
});
