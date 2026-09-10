import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RewardCreditResult {
  referrerId: string;
  redeemerUserId: string;
  rewardAmount: number;
  currency: string;
  status: 'CREDITED';
}

export interface ReferralDashboardData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  currency: string;
  history: any[];
}

@Injectable()
export class ReferralService {
  constructor(private readonly prisma: PrismaService) {}

  generateCode(userId: string): string {
    const prefix = 'REF';
    const uniqueHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${uniqueHash}`;
  }

  async validateCode(code: string) {
    const referral = await (this.prisma as any).referral.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!referral) {
      throw new NotFoundException('Invalid referral code');
    }

    if (referral.status !== 'PENDING') {
      throw new BadRequestException('Referral code is no longer active');
    }

    return referral;
  }

  async getOrCreateUserReferralCode(userId: string) {
    const existing = await (this.prisma as any).referral.findFirst({
      where: { referrerId: userId, status: 'PENDING' },
    });

    if (existing) {
      return existing;
    }

    let code = this.generateCode(userId);
    let attempts = 0;
    while (attempts < 5) {
      const conflict = await (this.prisma as any).referral.findUnique({ where: { code } });
      if (!conflict) break;
      code = this.generateCode(userId);
      attempts++;
    }

    return (this.prisma as any).referral.create({
      data: {
        referrerId: userId,
        code,
        rewardAmount: 15.0,
      },
    });
  }

  async processRewardEngine(referrerId: string, redeemerUserId: string, rewardAmount = 15.0): Promise<RewardCreditResult> {
    return {
      referrerId,
      redeemerUserId,
      rewardAmount,
      currency: 'USD',
      status: 'CREDITED',
    };
  }

  async redeemCode(redeemerUserId: string, code: string) {
    const referral = await this.validateCode(code);

    if (referral.referrerId === redeemerUserId) {
      throw new BadRequestException('You cannot redeem your own referral code');
    }

    const existingRedemption = await (this.prisma as any).referral.findFirst({
      where: { referredUserId: redeemerUserId, status: 'COMPLETED' },
    });

    if (existingRedemption) {
      throw new BadRequestException('User has already redeemed a referral code');
    }

    const updated = await (this.prisma as any).referral.update({
      where: { id: referral.id },
      data: {
        referredUserId: redeemerUserId,
        status: 'COMPLETED',
        redeemedAt: new Date(),
      },
    });

    const reward = await this.processRewardEngine(referral.referrerId, redeemerUserId, referral.rewardAmount);

    return {
      ...updated,
      reward,
    };
  }

  async getReferralDashboard(userId: string): Promise<ReferralDashboardData> {
    const userReferral = await this.getOrCreateUserReferralCode(userId);
    const completedReferrals = await (this.prisma as any).referral.findMany({
      where: { referrerId: userId, status: 'COMPLETED' },
    });

    const totalEarnings = completedReferrals.reduce((sum: number, r: any) => sum + (r.rewardAmount || 15.0), 0);

    return {
      referralCode: userReferral.code,
      totalReferrals: completedReferrals.length,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      currency: 'USD',
      history: completedReferrals,
    };
  }
}
