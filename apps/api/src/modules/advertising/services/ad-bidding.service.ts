import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdBiddingService {
  private readonly logger = new Logger(AdBiddingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCampaign(providerId: string, title: string, bidCpc: number, budget: number) {
    const campaignId = `camp_${Date.now()}`;
    this.logger.log(`Creating sponsored ad campaign ${campaignId} for provider ${providerId}`);
    return this.prisma.adCampaign.create({
      data: {
        campaignId,
        providerId,
        title,
        bidCpc,
        budget,
        status: 'ACTIVE',
      },
    });
  }

  async recordImpression(campaignId: string) {
    this.logger.log(`Incrementing ad impressions for campaign ${campaignId}`);
    return this.prisma.adCampaign.update({
      where: { campaignId },
      data: { impressions: { increment: 1 } },
    });
  }
}
