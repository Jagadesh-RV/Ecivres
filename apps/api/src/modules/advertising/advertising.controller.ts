import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdBiddingService } from './services/ad-bidding.service';
import { CreateAdCampaignDto } from './dto/create-campaign.dto';

@ApiTags('advertising')
@Controller('advertising')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdvertisingController {
  constructor(private readonly adService: AdBiddingService) {}

  @Post('campaigns')
  @ApiOperation({ summary: 'Create new sponsored ad campaign' })
  async createCampaign(@Body() dto: CreateAdCampaignDto) {
    return this.adService.createCampaign(dto.providerId, dto.title, dto.bidCpc, dto.budget);
  }

  @Post('campaigns/:id/impression')
  @ApiOperation({ summary: 'Record impression for sponsored ad campaign' })
  async recordImpression(@Param('id') id: string) {
    return this.adService.recordImpression(id);
  }
}
