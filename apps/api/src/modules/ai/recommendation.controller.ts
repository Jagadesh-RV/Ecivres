import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { SearchParserService } from './search-parser.service';
import { RecommendationQueryDto, RecommendedProviderResponseDto } from './dto/recommendation.dto';
import { SmartSearchDto } from './dto/smart-search.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai-search')
@Controller('ai')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly searchParserService: SearchParserService,
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
}
