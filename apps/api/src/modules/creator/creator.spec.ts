import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatorProfileService } from './services/creator-profile.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CreatorProfileService', () => {
  let service: CreatorProfileService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CreatorProfileService>(CreatorProfileService);
  });

  it('should create an affiliate creator profile with promo code', async () => {
    const res = await service.createCreatorProfile('u_creator_1', 'alex_home', ['instagram', 'tiktok']);
    expect(res.handle).toBe('alex_home');
    expect(res.promoCode).toBe('PROMO_ALEX_HOME');
    expect(res.commissionRatePercent).toBe(8.0);
  });

  it('should calculate accurate commission amount', async () => {
    const res = await service.calculateCommission(250.0, 10.0);
    expect(res.commissionUsd).toBe(25.0);
  });
});
