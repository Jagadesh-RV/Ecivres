import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { FraudIntelligenceService } from './services/fraud-intelligence.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FraudIntelligenceService', () => {
  let service: FraudIntelligenceService;

  const mockPrisma = {
    fraudRiskScore: {
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FraudIntelligenceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FraudIntelligenceService>(FraudIntelligenceService);
  });

  it('should calculate behavioral fraud score for target', async () => {
    mockPrisma.fraudRiskScore.upsert.mockResolvedValue({
      targetId: 'usr_1',
      behavioralScore: 12,
      riskLevel: 'LOW',
    });

    const res = await service.calculateBehavioralScore('usr_1', 'USER');
    expect(res.riskLevel).toBe('LOW');
  });

  it('should flag fake review for moderation', async () => {
    const res = await service.detectFakeReview('rev_1', 'Good', 5);
    expect(res.flaggedForModeration).toBe(true);
  });
});
