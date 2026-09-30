import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AcquisitionTrackingService } from './services/acquisition-tracking.service';
import { CampaignAttributionService } from './services/campaign-attribution.service';
import { CustomerActivationService } from './services/customer-activation.service';
import { TrackAcquisitionDto } from './dto/track-acquisition.dto';

@ApiTags('acquisition')
@Controller('acquisition')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AcquisitionController {
  constructor(
    private readonly trackingService: AcquisitionTrackingService,
    private readonly attributionService: CampaignAttributionService,
    private readonly activationService: CustomerActivationService,
  ) {}

  @Post('track')
  @ApiOperation({ summary: 'Record customer landing & campaign attribution' })
  async track(@Body() dto: TrackAcquisitionDto) {
    return this.trackingService.recordAcquisition(dto);
  }

  @Get('attribution/:userId')
  @ApiOperation({ summary: 'Get attributed campaign source & CAC for user' })
  async getAttribution(@Param('userId') userId: string) {
    return this.attributionService.attributeCustomerSource(userId);
  }

  @Get('activation/:userId')
  @ApiOperation({ summary: 'Get customer activation score & progress' })
  async getActivation(@Param('userId') userId: string) {
    return this.activationService.getActivationStatus(userId);
  }

  @Post('activation/milestone')
  @ApiOperation({ summary: 'Update customer activation progress milestone' })
  async updateMilestone(@Body() body: { userId: string; milestone: 'hasCompletedProfile' | 'hasPerformedSearch' | 'hasCompletedFirstBooking' | 'hasMadeFirstPayment' }) {
    return this.activationService.updateMilestone(body.userId, body.milestone);
  }
}
