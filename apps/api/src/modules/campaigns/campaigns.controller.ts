import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CampaignService } from './services/campaign.service';
import { PromotionService } from './services/promotion.service';
import { CampaignAnalyticsService } from './services/campaign-analytics.service';
import { CreateCampaignDto, RedeemCampaignDto } from './dto/create-campaign.dto';

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly promotionService: PromotionService,
    private readonly analyticsService: CampaignAnalyticsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new marketing promo campaign (Admin)' })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.campaignService.createCampaign(dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active promotional campaigns' })
  async getActive() {
    return this.campaignService.getAllActiveCampaigns();
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Apply promotion code to booking order' })
  async redeem(@Body() dto: RedeemCampaignDto) {
    return this.promotionService.applyPromotion(dto);
  }

  @Get('analytics/:campaignId')
  @ApiOperation({ summary: 'Get marketing campaign performance & ROI metrics (Admin)' })
  async getAnalytics(@Param('campaignId') campaignId: string) {
    return this.analyticsService.getCampaignPerformanceReport(campaignId);
  }
}
