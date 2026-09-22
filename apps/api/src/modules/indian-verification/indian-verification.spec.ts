import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { IndianVerificationService } from './services/indian-verification.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('IndianVerificationService', () => {
  let service: IndianVerificationService;

  const mockPrisma = {
    indianVerificationRecord: {
      upsert: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndianVerificationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<IndianVerificationService>(IndianVerificationService);
  });

  it('should verify Aadhaar hash workflow', async () => {
    mockPrisma.indianVerificationRecord.upsert.mockResolvedValue({
      providerId: 'prov_1',
      aadhaarHash: 'hash_9012',
      verificationStatus: 'PENDING',
    });

    const res = await service.verifyAadhaar('prov_1', '123456789012');
    expect(res.aadhaarHash).toBe('hash_9012');
  });
});
