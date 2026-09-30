import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignTargetingService } from './campaign-targeting.service';
import { RedeemCampaignDto } from '../dto/create-campaign.dto';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);
  private readonly redemptionsMap = new Map<string, Set<string>>(); // campaignId -> Set(userId)

  constructor(
    private readonly campaignService: CampaignService,
    private readonly targetingService: CampaignTargetingService,
  ) {}

  async applyPromotion(dto: RedeemCampaignDto) {
    const campaign = await this.campaignService.getCampaignByCode(dto.code);

    // Check anti-abuse duplicate user redemption
    const userRedemptions = this.redemptionsMap.get(campaign.id) || new Set();
    if (userRedemptions.has(dto.userId)) {
      throw new BadRequestException(`User ${dto.userId} has already redeemed promotion code '${dto.code}'`);
    }

    const check = this.targetingService.isEligibleForCampaign(campaign, dto.orderAmount, dto.category, dto.country);
    if (!check.eligible) {
      throw new BadRequestException(check.reason);
    }

    let discountAmount = 0;
    if (campaign.discountType === 'PERCENTAGE') {
      discountAmount = (dto.orderAmount * campaign.discountValue) / 100;
      if (campaign.maxDiscount && discountAmount > campaign.maxDiscount) {
        discountAmount = campaign.maxDiscount;
      }
    } else {
      discountAmount = campaign.discountValue;
    }

    if (discountAmount > dto.orderAmount) {
      discountAmount = dto.orderAmount;
    }

    campaign.spentBudget += discountAmount;
    campaign.redemptionCount += 1;
    userRedemptions.add(dto.userId);
    this.redemptionsMap.set(campaign.id, userRedemptions);

    this.logger.log(`Applied promo '${campaign.code}' for user ${dto.userId}: $${discountAmount} discount on order $${dto.orderAmount}`);
    return {
      campaignId: campaign.id,
      code: campaign.code,
      discountAmount,
      finalAmount: dto.orderAmount - discountAmount,
    };
  }
}
