import { Test, TestingModule } from '@nestjs/testing';
import { ReferralService } from './referral.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ReferralService', () => {
  let service: ReferralService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      referral: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCode', () => {
    it('should generate formatted code starting with REF-', () => {
      const code = service.generateCode('user-1');
      expect(code).toMatch(/^REF-[A-Z0-9]{6}$/);
    });
  });

  describe('redeemCode', () => {
    it('should prevent self referral', async () => {
      prismaService.referral.findUnique.mockResolvedValue({
        id: 'ref-1',
        referrerId: 'user-1',
        status: 'PENDING',
        code: 'REF-123456',
      });

      await expect(service.redeemCode('user-1', 'REF-123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should prevent duplicate redemption', async () => {
      prismaService.referral.findUnique.mockResolvedValue({
        id: 'ref-1',
        referrerId: 'user-1',
        status: 'PENDING',
        code: 'REF-123456',
      });
      prismaService.referral.findFirst.mockResolvedValue({
        id: 'ref-old',
        referredUserId: 'user-2',
        status: 'COMPLETED',
      });

      await expect(service.redeemCode('user-2', 'REF-123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
