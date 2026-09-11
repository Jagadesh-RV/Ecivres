import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { SplitPaymentService } from './split-payment.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('Payments 2.0 Services', () => {
  let walletService: WalletService;
  let splitService: SplitPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        SplitPaymentService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    splitService = module.get<SplitPaymentService>(SplitPaymentService);
  });

  describe('WalletService', () => {
    it('should top up wallet and credit cashback', async () => {
      let balance = await walletService.getBalance('u1');
      expect(balance).toBe(0);

      balance = await walletService.topUp('u1', 100, 'CARD');
      expect(balance).toBe(100);

      const cashback = await walletService.creditCashback('u1', 200, 5);
      expect(cashback).toBe(10);

      const finalBalance = await walletService.getBalance('u1');
      expect(finalBalance).toBe(110);
    });

    it('should create and redeem gift cards', async () => {
      const giftCard = await walletService.createGiftCard(50);
      expect(giftCard.remainingBalance).toBe(50);

      const newBalance = await walletService.redeemGiftCard('u2', giftCard.code);
      expect(newBalance).toBe(50);
    });
  });

  describe('SplitPaymentService', () => {
    it('should split bill evenly among co-payers', async () => {
      const group = await splitService.createSplitBooking('b100', 300, ['p1@ex.com', 'p2@ex.com', 'p3@ex.com']);
      expect(group.parties.length).toBe(3);
      expect(group.parties[0].shareAmount).toBe(100);
    });

    it('should calculate EMI plans correctly', async () => {
      const plans = await splitService.calculateEmiOptions(1200);
      expect(plans.length).toBe(3);
      expect(plans[0].months).toBe(3);
      expect(plans[0].monthlyInstallment).toBe(400);
    });

    it('should convert currencies accurately', async () => {
      const converted = await splitService.convertCurrency(100, 'USD', 'EUR');
      expect(converted).toBe(92);
    });
  });
});
