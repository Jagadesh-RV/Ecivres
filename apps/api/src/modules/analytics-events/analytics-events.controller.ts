import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventCollectorService } from './services/event-collector.service';

@ApiTags('analytics-events')
@Controller('analytics-events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsEventsController {
  constructor(private readonly eventService: EventCollectorService) {}

  @Post('track-booking')
  @ApiOperation({ summary: 'Track booking lifecycle event' })
  async trackBooking(@Body() body: { userId: string; bookingId: string; eventType: string; payload: any }) {
    return this.eventService.trackBookingEvent(body.userId, body.bookingId, body.eventType, body.payload);
  }

  @Post('track-payment')
  @ApiOperation({ summary: 'Track payment status event stream' })
  async trackPayment(@Body() body: { userId: string; paymentIntentId: string; amountUSD: number; status: string }) {
    return this.eventService.trackPaymentEvent(body.userId, body.paymentIntentId, body.amountUSD, body.status);
  }

  @Post('track-search')
  @ApiOperation({ summary: 'Track search query analytics stream' })
  async trackSearch(@Body() body: { userId: string; searchQuery: string; categoryId?: string }) {
    return this.eventService.trackSearchEvent(body.userId, body.searchQuery, body.categoryId);
  }
}
