import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceLiquidityService } from './services/marketplace-liquidity.service';
import { SupplyDemandAnalyticsService } from './services/supply-demand-analytics.service';
import { MarketplaceHealthService } from './services/marketplace-health.service';

describe('LiquidityModule Services', () => {
  let liquidityService: MarketplaceLiquidityService;
  let supplyDemandService: SupplyDemandAnalyticsService;
  let healthService: MarketplaceHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplaceLiquidityService, SupplyDemandAnalyticsService, MarketplaceHealthService],
    }).compile();

    liquidityService = module.get<MarketplaceLiquidityService>(MarketplaceLiquidityService);
    supplyDemandService = module.get<SupplyDemandAnalyticsService>(SupplyDemandAnalyticsService);
    healthService = module.get<MarketplaceHealthService>(MarketplaceHealthService);
  });

  it('should return category liquidity metrics when data exists', () => {
    const res = liquidityService.getCategoryLiquidity('HVAC', 'New York');
    expect(res.status).toBe('LIQUID');
    expect(res.activeProviders).toBeGreaterThan(0);
    expect(res.conversionRatePercent).toBeGreaterThan(0);
  });

  it('should return INSUFFICIENT_DATA fallback when search volume is 0 or empty region', () => {
    const res = supplyDemandService.getSupplyDemandRatio('empty');
    expect(res.status).toBe('INSUFFICIENT_DATA');
  });

  it('should calculate global marketplace health overview metrics', () => {
    const health = healthService.getMarketplaceHealthOverview();
    expect(health.overallHealthScore).toBe('OPTIMAL');
    expect(health.completionRatePercent).toBeGreaterThan(90);
  });
});
