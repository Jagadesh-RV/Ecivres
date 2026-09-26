import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QrGeneratorService } from './qr-generator.service';

@Injectable()
export class ViralReferralService {
  private readonly logger = new Logger(ViralReferralService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly qrGenerator: QrGeneratorService,
  ) {}

  async trackInvite(referrerId: string, refereeId: string, referralCode: string) {
    if (referrerId === refereeId) {
      throw new BadRequestException('Users cannot refer themselves');
    }

    const existingRef = await this.prisma.referralTreeRecord.findUnique({
      where: { refereeId },
    });

    if (existingRef) {
      return existingRef;
    }

    const qrCodeUrl = this.qrGenerator.generateReferralQrCode(referrerId, referralCode);

    this.logger.log(`Tracked new viral invite: ${referrerId} -> ${refereeId} (Code: ${referralCode})`);
    return this.prisma.referralTreeRecord.create({
      data: {
        referrerId,
        refereeId,
        referralCode,
        qrCodeUrl,
        status: 'PENDING',
        rewardAmountUsd: 15.0,
      },
    });
  }

  async qualifyAndRewardReferral(refereeId: string, bookingAmountUsd: number) {
    if (bookingAmountUsd < 20.0) {
      this.logger.warn(`Referee ${refereeId} booking amount $${bookingAmountUsd} below $20 threshold for referral reward`);
      return null;
    }

    const referral = await this.prisma.referralTreeRecord.findUnique({
      where: { refereeId },
    });

    if (!referral || referral.status !== 'PENDING') {
      return referral;
    }

    this.logger.log(`Rewarding referrer ${referral.referrerId} $${referral.rewardAmountUsd} USD for referee ${refereeId} completion!`);
    return this.prisma.referralTreeRecord.update({
      where: { refereeId },
      data: {
        status: 'REWARDED',
        rewardEarnedAt: new Date(),
      },
    });
  }
}
