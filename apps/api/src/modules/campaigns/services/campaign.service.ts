import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from '../dto/create-campaign.dto';

export interface CampaignEntity extends CreateCampaignDto {
  id: string;
  spentBudget: number;
  redemptionCount: number;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);
  private readonly campaigns = new Map<string, CampaignEntity>();

  async createCampaign(dto: CreateCampaignDto): Promise<CampaignEntity> {
    const existing = Array.from(this.campaigns.values()).find((c) => c.code.toUpperCase() === dto.code.toUpperCase());
    if (existing) {
      throw new BadRequestException(`Campaign with promo code '${dto.code}' already exists`);
    }

    const campaign: CampaignEntity = {
      ...dto,
      id: `cmp_${Date.now()}`,
      code: dto.code.toUpperCase(),
      spentBudget: 0,
      redemptionCount: 0,
      isActive: true,
      createdAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
    this.logger.log(`Created marketing campaign '${campaign.title}' (Code: ${campaign.code}, Budget: $${campaign.totalBudget})`);
    return campaign;
  }

  async getCampaignByCode(code: string): Promise<CampaignEntity> {
    const campaign = Array.from(this.campaigns.values()).find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!campaign) {
      throw new NotFoundException(`Campaign with promo code '${code}' not found`);
    }
    return campaign;
  }

  async getAllActiveCampaigns(): Promise<CampaignEntity[]> {
    return Array.from(this.campaigns.values()).filter((c) => c.isActive);
  }
}
