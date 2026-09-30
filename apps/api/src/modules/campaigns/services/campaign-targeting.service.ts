import { Injectable, Logger } from '@nestjs/common';
import { CampaignEntity } from './campaign.service';

@Injectable()
export class CampaignTargetingService {
  private readonly logger = new Logger(CampaignTargetingService.name);

  isEligibleForCampaign(campaign: CampaignEntity, orderAmount: number, category?: string, country?: string): { eligible: boolean; reason?: string } {
    const now = new Date();
    if (!campaign.isActive) {
      return { eligible: false, reason: 'Campaign is inactive' };
    }
    if (new Date(campaign.startDate) > now || new Date(campaign.endDate) < now) {
      return { eligible: false, reason: 'Campaign is outside active date window' };
    }
    if (campaign.minOrderValue && orderAmount < campaign.minOrderValue) {
      return { eligible: false, reason: `Minimum order value of $${campaign.minOrderValue} required` };
    }
    if (campaign.spentBudget >= campaign.totalBudget) {
      return { eligible: false, reason: 'Campaign budget limit reached' };
    }
    if (campaign.maxRedemptions && campaign.redemptionCount >= campaign.maxRedemptions) {
      return { eligible: false, reason: 'Campaign max redemption limit reached' };
    }
    if (campaign.targetCategory && category && campaign.targetCategory.toLowerCase() !== category.toLowerCase()) {
      return { eligible: false, reason: `Campaign restricted to category ${campaign.targetCategory}` };
    }
    if (campaign.targetCountry && country && campaign.targetCountry.toUpperCase() !== country.toUpperCase()) {
      return { eligible: false, reason: `Campaign restricted to country ${campaign.targetCountry}` };
    }

    this.logger.log(`Targeting evaluation PASSED for campaign ${campaign.code}`);
    return { eligible: true };
  }
}
