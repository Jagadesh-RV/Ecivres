import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { SearchParserService } from './search-parser.service';
import { AiAssistantService, AssistantConversationContext } from './assistant.service';
import { AiPricingAssistantService } from './pricing-assistant.service';
import { AiCustomerInsightsService } from './customer-insights.service';
import { RecommendationQueryDto, RecommendedProviderResponseDto } from './dto/recommendation.dto';
import { SmartSearchDto } from './dto/smart-search.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ai-search')
@Controller('ai')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly searchParserService: SearchParserService,
    private readonly assistantService: AiAssistantService,
    private readonly pricingAssistantService: AiPricingAssistantService,
    private readonly customerInsightsService: AiCustomerInsightsService,
  ) {}

  @Get('recommendations/providers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI recommended providers for customer' })
  @ApiResponse({ status: 200, type: [RecommendedProviderResponseDto] })
  async getRecommendedProviders(
    @Query() query: RecommendationQueryDto,
  ): Promise<RecommendedProviderResponseDto[]> {
    return this.recommendationService.getRecommendedProviders(query);
  }

  @Post('smart-search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Parse natural language search query and return matched recommendations' })
  async smartSearch(@Body() body: SmartSearchDto) {
    const parsed = this.searchParserService.parseQuery(body.query);
    const providers = await this.recommendationService.getRecommendedProviders({
      latitude: body.latitude,
      longitude: body.longitude,
      limit: 10,
    });

    return {
      parsedQuery: parsed,
      results: providers,
    };
  }

  @Post('assistant')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'AI Assistant query endpoint for customers and providers' })
  async assistantQuery(
    @CurrentUser() user: any,
    @Body() body: { message: string; role?: 'CUSTOMER' | 'PROVIDER'; bookingId?: string },
  ) {
    const context: AssistantConversationContext = {
      userId: user?.id || 'guest',
      userRole: body.role || 'CUSTOMER',
      message: body.message,
      bookingId: body.bookingId,
    };

    return this.assistantService.processUserMessage(context);
  }

  @Get('pricing/dynamic')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI dynamic pricing recommendation for service' })
  async getDynamicPrice(
    @CurrentUser() user: any,
    @Query('serviceId') serviceId: string,
    @Query('demandMultiplier') demandMultiplier?: number,
  ) {
    return this.pricingAssistantService.calculateDynamicPrice(
      serviceId,
      user.id,
      demandMultiplier ? Number(demandMultiplier) : 1.0,
    );
  }

  @Get('customer/insights')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI customer spending pattern & churn risk insights' })
  async getCustomerInsights(@CurrentUser() user: any) {
    return this.customerInsightsService.getCustomerInsights(user.id);
  }
}

