import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { DamageAssessmentService } from './services/damage-assessment.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DamageAssessmentService', () => {
  let service: DamageAssessmentService;

  const mockPrisma = {
    insuranceDamageClaim: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DamageAssessmentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DamageAssessmentService>(DamageAssessmentService);
  });

  it('should auto approve claim under $5000 threshold', async () => {
    mockPrisma.insuranceDamageClaim.create.mockResolvedValue({
      damageClaimId: 'clm_1',
      policyId: 'pol_1',
      assessedAmount: 1250,
      coverageValid: true,
      status: 'APPROVED_FOR_PAYOUT',
    });

    const res = await service.submitClaim('pol_1', 'prov_1', 1250);
    expect(res.damageClaimId).toBe('clm_1');
    expect(res.status).toBe('APPROVED_FOR_PAYOUT');
  });
});
