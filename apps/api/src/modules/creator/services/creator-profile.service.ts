import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CreatorProfileService {
  private readonly logger = new Logger(CreatorProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCreatorProfile(userId: string, handle: string, socialChannels: string[], commissionRatePercent = 8.0) {
    const promoCode = `PROMO_${handle.toUpperCase()}`;
    this.logger.log(`Created creator profile for @${handle} (${userId}) with promo ${promoCode}`);
    return {
      creatorId: `crt_${Date.now()}`,
      userId,
      handle,
      socialChannels,
      commissionRatePercent,
      promoCode,
      status: 'ACTIVE',
    };
  }

  async calculateCommission(bookingAmountUsd: number, commissionRatePercent: number) {
    const commissionUsd = Number(((bookingAmountUsd * commissionRatePercent) / 100).toFixed(2));
    this.logger.log(`Calculated creator commission: $${commissionUsd} USD (${commissionRatePercent}% on $${bookingAmountUsd})`);
    return {
      bookingAmountUsd,
      commissionRatePercent,
      commissionUsd,
    };
  }

  async trackCampaign(creatorId: string, campaignName: string, targetCategory: string) {
    const campaignId = `cmp_${Date.now()}`;
    this.logger.log(`Created campaign ${campaignId} "${campaignName}" for creator ${creatorId}`);
    return {
      campaignId,
      creatorId,
      campaignName,
      targetCategory,
      clicksCount: 0,
      conversionsCount: 0,
      totalGmvUsd: 0.0,
    };
  }
}
