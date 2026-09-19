import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { LeadScoringService } from './services/lead-scoring.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LeadScoringService', () => {
  let service: LeadScoringService;

  const mockPrisma = {
    customerCrmRecord: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadScoringService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LeadScoringService>(LeadScoringService);
  });

  it('should evaluate lead score segment correctly', async () => {
    const res = await service.calculateLeadScore(5, 500);
    expect(res.leadScore).toBe(85);
    expect(res.segment).toBe('VIP');
  });
});
