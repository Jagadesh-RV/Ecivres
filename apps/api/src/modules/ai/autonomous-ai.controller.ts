import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BookingPlannerService, BookingPlanRequest } from './booking-planner.service';
import { NegotiationAssistantService, OfferNegotiationRequest } from './negotiation-assistant.service';
import { AutoReschedulingService, RescheduleRequest } from './auto-rescheduling.service';
import { ProviderAgentService } from './provider-agent.service';

@Controller('ai/autonomous')
export class AutonomousAiController {
  constructor(
    private readonly bookingPlanner: BookingPlannerService,
    private readonly negotiationAssistant: NegotiationAssistantService,
    private readonly autoRescheduling: AutoReschedulingService,
    private readonly providerAgent: ProviderAgentService,
  ) {}

  @Post('plan-booking')
  async planBooking(@Body() body: BookingPlanRequest) {
    return this.bookingPlanner.generateAutonomousPlan(body);
  }

  @Post('negotiate')
  negotiateOffer(@Body() body: OfferNegotiationRequest) {
    return this.negotiationAssistant.analyzeCounterOffer(body);
  }

  @Post('auto-reschedule')
  autoReschedule(@Body() body: RescheduleRequest) {
    return this.autoRescheduling.suggestOptimalReschedule(body);
  }

  @Get('provider-retention')
  getProviderRetention(@Query('providerId') providerId: string) {
    return this.providerAgent.getRetentionSuggestions(providerId);
  }
}
