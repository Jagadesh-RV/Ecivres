import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LoyaltyTierService {
  private readonly logger = new Logger(LoyaltyTierService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUserTier(userId: string) {
    this.logger.log(`Fetching loyalty tier for user ${userId}`);
    const account = await this.prisma.loyaltyAccount.findUnique({
      where: { userId },
    });
    if (!account) {
      return { tier: 'BRONZE', points: 0, cashbackBalance: 0.0 };
    }
    return account;
  }

  async calculateCashback(userId: string, amount: number) {
    const account = await this.getUserTier(userId);
    let rate = 0.02; // Bronze: 2%
    if (account.tier === 'SILVER') rate = 0.05;
    else if (account.tier === 'GOLD') rate = 0.08;
    else if (account.tier === 'PLATINUM') rate = 0.12;

    const cashbackEarned = Math.round(amount * rate * 100) / 100;
    this.logger.log(`Calculated cashback for user ${userId}: $${cashbackEarned} (Tier: ${account.tier})`);
    return {
      userId,
      amount,
      tier: account.tier,
      cashbackEarned,
      newBalance: (account.cashbackBalance || 0) + cashbackEarned,
    };
  }
}
