import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { RecommendationQueryDto, RecommendedProviderResponseDto } from './dto/recommendation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('providers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI recommended providers for customer' })
  @ApiResponse({ status: 200, type: [RecommendedProviderResponseDto] })
  async getRecommendedProviders(
    @Query() query: RecommendationQueryDto,
  ): Promise<RecommendedProviderResponseDto[]> {
    return this.recommendationService.getRecommendedProviders(query);
  }
}
