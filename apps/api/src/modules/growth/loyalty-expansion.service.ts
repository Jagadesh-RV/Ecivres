import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type ExtendedVipTier = 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND_ELITE';

export interface LoyaltyStatus {
  userId: string;
  tier: ExtendedVipTier;
  totalPoints: number;
  perks: string[];
  birthdayRewardAvailable: boolean;
  surpriseBonusUnlocked: boolean;
}

@Injectable()
export class LoyaltyExpansionService {
  constructor(private readonly prisma: PrismaService) {}

  async getLoyaltyStatus(userId: string, birthMonth?: number): Promise<LoyaltyStatus> {
    // Mock user spend lookup or fetch from database
    const totalPoints = 6500;

    let tier: ExtendedVipTier = 'SILVER';
    const perks: string[] = ['Standard Support'];

    if (totalPoints >= 10000) {
      tier = 'DIAMOND_ELITE';
      perks.push('20% Cashback', 'Dedicated Account Manager', 'Free Emergency Dispatch');
    } else if (totalPoints >= 5000) {
      tier = 'PLATINUM';
      perks.push('15% Cashback', 'Priority Support Queue', 'Free Cancellation');
    } else if (totalPoints >= 2500) {
      tier = 'GOLD';
      perks.push('10% Cashback', 'Free Express Booking');
    }

    const currentMonth = new Date().getMonth() + 1;
    const birthdayRewardAvailable = birthMonth === currentMonth;

    return {
      userId,
      tier,
      totalPoints,
      perks,
      birthdayRewardAvailable,
      surpriseBonusUnlocked: totalPoints % 500 === 0,
    };
  }

  async claimBirthdayReward(userId: string): Promise<{ claimed: boolean; rewardCode: string; discountAmount: number }> {
    return {
      claimed: true,
      rewardCode: `BDAY-${Math.floor(1000 + Math.random() * 9000)}`,
      discountAmount: 30,
    };
  }
}
