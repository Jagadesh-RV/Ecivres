import { Module } from '@nestjs/common';
import { CampaignService } from './services/campaign.service';
import { CampaignTargetingService } from './services/campaign-targeting.service';
import { PromotionService } from './services/promotion.service';
import { CampaignAnalyticsService } from './services/campaign-analytics.service';
import { CampaignsController } from './campaigns.controller';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignService, CampaignTargetingService, PromotionService, CampaignAnalyticsService],
  exports: [CampaignService, CampaignTargetingService, PromotionService, CampaignAnalyticsService],
})
export class CampaignsModule {}
