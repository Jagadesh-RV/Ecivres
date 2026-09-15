import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { SearchParserService } from './search-parser.service';
import { AiAssistantService } from './assistant.service';
import { AiPricingAssistantService } from './pricing-assistant.service';
import { AiCustomerInsightsService } from './customer-insights.service';
import { RecommendationController } from './recommendation.controller';
import { AutonomousAiController } from './autonomous-ai.controller';
import { BookingPlannerService } from './booking-planner.service';
import { NegotiationAssistantService } from './negotiation-assistant.service';
import { AutoReschedulingService } from './auto-rescheduling.service';
import { ProviderAgentService } from './provider-agent.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController, AutonomousAiController],
  providers: [
    RecommendationService,
    SearchParserService,
    AiAssistantService,
    AiPricingAssistantService,
    AiCustomerInsightsService,
    BookingPlannerService,
    NegotiationAssistantService,
    AutoReschedulingService,
    ProviderAgentService,
  ],
  exports: [
    RecommendationService,
    SearchParserService,
    AiAssistantService,
    AiPricingAssistantService,
    AiCustomerInsightsService,
    BookingPlannerService,
    NegotiationAssistantService,
    AutoReschedulingService,
    ProviderAgentService,
  ],
})
export class AiModule {}

