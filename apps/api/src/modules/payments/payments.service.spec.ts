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

  describe('Saved Payment Methods', () => {
    it('should retrieve default saved payment method for user', async () => {
      const methods = await service.getSavedPaymentMethods('user-100');
      expect(methods).toHaveLength(1);
      expect(methods[0].last4).toEqual('4242');
      expect(methods[0].isDefault).toBe(true);
    });

    it('should add a new payment method and update default status if requested', async () => {
      const added = await service.addPaymentMethod('user-100', {
        cardholderName: 'Jane Smith',
        brand: 'Mastercard',
        last4: '8888',
        expMonth: 10,
        expYear: 2028,
        isDefault: true,
      });

      expect(added.id).toBeDefined();
      expect(added.brand).toEqual('Mastercard');

      const methods = await service.getSavedPaymentMethods('user-100');
      expect(methods).toHaveLength(2);
      expect(methods.find((m) => m.id === added.id)?.isDefault).toBe(true);
      expect(methods.find((m) => m.id === 'pm-default-1')?.isDefault).toBe(false);
    });

    it('should set default payment method by ID', async () => {
      await service.setDefaultPaymentMethod('user-100', 'pm-default-1');
      const methods = await service.getSavedPaymentMethods('user-100');
      expect(methods.find((m) => m.id === 'pm-default-1')?.isDefault).toBe(true);
    });

    it('should delete a payment method', async () => {
      const methods = await service.getSavedPaymentMethods('user-100');
      const targetId = methods[0].id;
      const result = await service.deletePaymentMethod('user-100', targetId);
      expect(result.success).toBe(true);
    });

    it('should process mockSettlePayment successfully', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.payment = {
        findUnique: jest.fn().mockResolvedValue({
          id: 'pay-1',
          bookingId: 'b-1',
          amount: 150,
          status: 'PENDING',
          booking: { status: 'PENDING', service: { provider: { userId: 'prov-1' }, name: 'Roofing' } },
        }),
        update: jest.fn().mockResolvedValue({
          id: 'pay-1',
          status: 'SUCCESS',
          transactionId: 'MOCK-TXN-123',
        }),
      };
      mockPrisma.booking = {
        update: jest.fn().mockResolvedValue({ id: 'b-1', status: 'CONFIRMED' }),
      };
      (service as any).notificationsService = {
        create: jest.fn().mockResolvedValue({}),
      };

      const res = await service.mockSettlePayment('b-1');
      expect(res.status).toBe('SUCCESS');
      expect(mockPrisma.payment.update).toHaveBeenCalled();
    });
  });
});

