import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StripeWebhookService', () => {
  let service: StripeWebhookService;

  const mockPrisma = {
    stripeConnectAccount: {
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeWebhookService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StripeWebhookService>(StripeWebhookService);
  });

  it('should process payout webhook successfully', async () => {
    mockPrisma.stripeConnectAccount.updateMany.mockResolvedValue({ count: 1 });
    const event = {
      type: 'payout.paid',
      data: { object: { id: 'po_1', account: 'acct_1', amount: 5000, status: 'paid' } },
    };
    const res = await service.handlePayoutWebhook(event);
    expect(res.received).toBe(true);
  });
});
