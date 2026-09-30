import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MarketplaceLiquidityService } from './services/marketplace-liquidity.service';
import { SupplyDemandAnalyticsService } from './services/supply-demand-analytics.service';
import { MarketplaceHealthService } from './services/marketplace-health.service';

@ApiTags('liquidity')
@Controller('liquidity')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LiquidityController {
  constructor(
    private readonly liquidityService: MarketplaceLiquidityService,
    private readonly supplyDemandService: SupplyDemandAnalyticsService,
    private readonly healthService: MarketplaceHealthService,
  ) {}

  @Get('category')
  @ApiOperation({ summary: 'Get marketplace category liquidity metrics' })
  async getCategoryLiquidity(@Query('category') category: string, @Query('city') city: string) {
    return this.liquidityService.getCategoryLiquidity(category || 'ALL', city || 'ALL');
  }

  @Get('supply-demand/:region')
  @ApiOperation({ summary: 'Get regional supply vs demand ratio & unfulfilled search metrics' })
  async getSupplyDemand(@Param('region') region: string) {
    return this.supplyDemandService.getSupplyDemandRatio(region);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get overall marketplace health metrics dashboard (Admin)' })
  async getHealth() {
    return this.healthService.getMarketplaceHealthOverview();
  }
}
