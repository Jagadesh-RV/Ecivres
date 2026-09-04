import { Test, TestingModule } from '@nestjs/testing';
import { PayoutsService } from './payouts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PayoutsService', () => {
  let service: PayoutsService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      providerProfile: {
        findUnique: jest.fn().mockResolvedValue({ id: 'p-1', userId: 'provider-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<PayoutsService>(PayoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate payout summary correctly', async () => {
    const summary = await service.getPayoutSummary('provider-1');
    expect(summary.availableBalance).toBeGreaterThanOrEqual(0);
    expect(summary.pendingAmount).toBeDefined();
  });

  it('should process payout request if balance is sufficient', async () => {
    const payout = await service.requestPayout('provider-1', {
      amount: 100,
      bankAccountName: 'Test Bank',
      accountNumber: '1234567890',
      routingNumber: '987654321',
    });

    expect(payout.id).toBeDefined();
    expect(payout.amount).toBe(100);
    expect(payout.status).toBe('PENDING');
  });

  it('should throw BadRequestException when requested payout exceeds balance', async () => {
    await expect(
      service.requestPayout('provider-1', {
        amount: 99999,
        bankAccountName: 'Test Bank',
        accountNumber: '1234567890',
        routingNumber: '987654321',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should approve payout request', async () => {
    const approved = await service.approvePayout('payout-101');
    expect(approved.status).toBe('APPROVED');
    expect(approved.processedAt).toBeDefined();
  });
});
