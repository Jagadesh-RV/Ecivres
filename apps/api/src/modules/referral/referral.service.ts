import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}
