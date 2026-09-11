import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { SearchParserService } from './search-parser.service';
import { AiAssistantService } from './assistant.service';
import { AiPricingAssistantService } from './pricing-assistant.service';
import { AiCustomerInsightsService } from './customer-insights.service';
import { RecommendationController } from './recommendation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    SearchParserService,
    AiAssistantService,
    AiPricingAssistantService,
    AiCustomerInsightsService,
  ],
  exports: [
    RecommendationService,
    SearchParserService,
    AiAssistantService,
    AiPricingAssistantService,
    AiCustomerInsightsService,
  ],
})
export class AiModule {}

