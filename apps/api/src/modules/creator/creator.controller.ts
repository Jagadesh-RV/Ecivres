import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatorProfileService } from './services/creator-profile.service';

@ApiTags('creator')
@Controller('creator')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CreatorController {
  constructor(private readonly creatorService: CreatorProfileService) {}

  @Post('profile')
  @ApiOperation({ summary: 'Create affiliate creator profile' })
  async createProfile(@Body() body: { userId: string; handle: string; socialChannels: string[]; commissionRatePercent?: number }) {
    return this.creatorService.createCreatorProfile(body.userId, body.handle, body.socialChannels, body.commissionRatePercent);
  }

  @Post('calculate-commission')
  @ApiOperation({ summary: 'Calculate affiliate creator commission amount' })
  async calculateCommission(@Body() body: { bookingAmountUsd: number; commissionRatePercent: number }) {
    return this.creatorService.calculateCommission(body.bookingAmountUsd, body.commissionRatePercent);
  }

  @Post('campaign')
  @ApiOperation({ summary: 'Create influencer marketing campaign' })
  async createCampaign(@Body() body: { creatorId: string; campaignName: string; targetCategory: string }) {
    return this.creatorService.trackCampaign(body.creatorId, body.campaignName, body.targetCategory);
  }
}
