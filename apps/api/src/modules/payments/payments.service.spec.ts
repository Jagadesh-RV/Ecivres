import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StripeService } from './stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: NotificationsService,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProviderEarningsSummary', () => {
    it('should calculate gross revenue, 10% platform commission fee, and net earnings', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.providerProfile = {
        findUnique: jest.fn().mockResolvedValue({ id: 'p-1', userId: 'user-1' }),
      };
      mockPrisma.payment = {
        findMany: jest.fn().mockResolvedValue([
          { id: 'pay-1', amount: 500, status: 'SUCCESS' },
          { id: 'pay-2', amount: 300, status: 'SUCCESS' },
        ]),
      };

      const result = await service.getProviderEarningsSummary('user-1');

      expect(result.grossRevenue).toEqual(800);
      expect(result.totalPlatformFees).toEqual(80);
      expect(result.netEarnings).toEqual(720);
      expect(result.completedTransactionsCount).toEqual(2);
    });
  });
});
