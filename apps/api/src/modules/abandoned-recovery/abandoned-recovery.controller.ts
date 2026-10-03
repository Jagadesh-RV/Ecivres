import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AbandonedBookingService } from './services/abandoned-booking.service';
import { RecoveryCampaignService } from './services/recovery-campaign.service';

@ApiTags('abandoned-recovery')
@Controller('abandoned-recovery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AbandonedRecoveryController {
  constructor(
    private readonly abandonedService: AbandonedBookingService,
    private readonly campaignService: RecoveryCampaignService,
  ) {}

  @Post('event')
  @ApiOperation({ summary: 'Track abandoned search, view, or booking event' })
  async recordEvent(@Body() body: { userId: string; eventType: 'SEARCH' | 'SERVICE_VIEW' | 'PROVIDER_VIEW' | 'BOOKING_FORM' | 'PAYMENT'; metadata?: any }) {
    return this.abandonedService.recordAbandonedEvent(body.userId, body.eventType, body.metadata);
  }

  @Get('events/:userId')
  @ApiOperation({ summary: 'Get unrecovered abandoned events for user' })
  async getEvents(@Param('userId') userId: string) {
    return this.abandonedService.getUnrecoveredEvents(userId);
  }

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger abandoned booking recovery campaign' })
  async triggerRecovery(@Body() body: { userId: string; optIn?: boolean }) {
    return this.campaignService.triggerRecoveryCampaign(body.userId, body.optIn !== false);
  }
}
