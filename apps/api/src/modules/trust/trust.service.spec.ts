import { Test, TestingModule } from '@nestjs/testing';
import { TrustService } from './trust.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TrustService', () => {
  let service: TrustService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      providerProfile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      customerProfile: {
        findUnique: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrustService>(TrustService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitVerificationDocument', () => {
    it('should submit verification document for provider', async () => {
      (prismaService.providerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'prov-1',
        userId: 'usr-1',
      });

      const res = await service.submitVerificationDocument('usr-1', {
        documentType: 'GOVT_ID',
        documentUrl: 'https://s3.aws.com/doc.pdf',
      });

      expect(res.status).toBe('PENDING_REVIEW');
      expect(res.providerId).toBe('prov-1');
    });
  });

  describe('approveProviderDocument', () => {
    it('should mark provider verified on document approval', async () => {
      (prismaService.providerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'prov-1',
      });
      (prismaService.providerProfile.update as jest.Mock).mockResolvedValue({
        id: 'prov-1',
        isVerified: true,
      });

      const res = await service.approveProviderDocument('prov-1', 'doc-101', 'admin-1');

      expect(res.isVerified).toBe(true);
      expect(res.status).toBe('APPROVED');
    });
  });

  describe('detectSuspiciousActivity', () => {
    it('should flag user with multiple cancellations and failed payments as HIGH risk', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-suspect',
        bookings: [
          { status: 'CANCELLED', payment: { status: 'FAILED' } },
          { status: 'CANCELLED', payment: { status: 'FAILED' } },
          { status: 'CANCELLED', payment: { status: 'SUCCESS' } },
        ],
      });

      const result = await service.detectSuspiciousActivity('usr-suspect');

      expect(result.riskLevel).toBe('HIGH');
      expect(result.triggers).toContain('HIGH_CANCELLATION_VELOCITY');
      expect(result.triggers).toContain('MULTIPLE_FAILED_PAYMENTS');
    });
  });
});
