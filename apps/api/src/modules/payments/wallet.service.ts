import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'TOPUP' | 'CASHBACK' | 'GIFT_CARD' | 'BOOKING_PAYMENT' | 'REFUND';
  description: string;
  createdAt: Date;
}

export interface GiftCard {
  code: string;
  initialBalance: number;
  remainingBalance: number;
  expiryDate: Date;
  active: boolean;
}

@Injectable()
export class WalletService {
  private walletBalances: Map<string, number> = new Map();
  private transactions: Map<string, WalletTransaction[]> = new Map();
  private giftCards: Map<string, GiftCard> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string): Promise<number> {
    return this.walletBalances.get(userId) || 0;
  }

  async topUp(userId: string, amount: number, paymentMethod: string): Promise<number> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const current = await this.getBalance(userId);
    const updated = current + amount;
    this.walletBalances.set(userId, updated);

    this.recordTransaction(userId, {
      amount,
      type: 'TOPUP',
      description: `Wallet top-up via ${paymentMethod}`,
    });

    return updated;
  }

  async creditCashback(userId: string, bookingAmount: number, percentage: number = 5): Promise<number> {
    const cashback = Math.round((bookingAmount * percentage) / 100);
    if (cashback > 0) {
      const current = await this.getBalance(userId);
      const updated = current + cashback;
      this.walletBalances.set(userId, updated);

      this.recordTransaction(userId, {
        amount: cashback,
        type: 'CASHBACK',
        description: `${percentage}% cashback reward on booking`,
      });
    }
    return cashback;
  }

  async createGiftCard(amount: number): Promise<GiftCard> {
    const code = `ECV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const giftCard: GiftCard = {
      code,
      initialBalance: amount,
      remainingBalance: amount,
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      active: true,
    };
    this.giftCards.set(code, giftCard);
    return giftCard;
  }

  async redeemGiftCard(userId: string, code: string): Promise<number> {
    const giftCard = this.giftCards.get(code);
    if (!giftCard || !giftCard.active) {
      throw new NotFoundException('Invalid or expired gift card code');
    }
    if (giftCard.remainingBalance <= 0) {
      throw new BadRequestException('Gift card balance is depleted');
    }

    const redeemAmount = giftCard.remainingBalance;
    giftCard.remainingBalance = 0;
    giftCard.active = false;

    const current = await this.getBalance(userId);
    const updated = current + redeemAmount;
    this.walletBalances.set(userId, updated);

    this.recordTransaction(userId, {
      amount: redeemAmount,
      type: 'GIFT_CARD',
      description: `Gift card redemption (${code})`,
    });

    return updated;
  }

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    return this.transactions.get(userId) || [];
  }

  private recordTransaction(userId: string, dto: Omit<WalletTransaction, 'id' | 'userId' | 'createdAt'>) {
    const list = this.transactions.get(userId) || [];
    list.unshift({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: new Date(),
      ...dto,
    });
    this.transactions.set(userId, list);
  }
}
