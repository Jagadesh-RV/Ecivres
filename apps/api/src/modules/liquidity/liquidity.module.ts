import { Module } from '@nestjs/common';
import { MarketplaceLiquidityService } from './services/marketplace-liquidity.service';
import { SupplyDemandAnalyticsService } from './services/supply-demand-analytics.service';
import { MarketplaceHealthService } from './services/marketplace-health.service';
import { LiquidityController } from './liquidity.controller';

@Module({
  controllers: [LiquidityController],
  providers: [MarketplaceLiquidityService, SupplyDemandAnalyticsService, MarketplaceHealthService],
  exports: [MarketplaceLiquidityService, SupplyDemandAnalyticsService, MarketplaceHealthService],
})
export class LiquidityModule {}
