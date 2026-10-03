import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceEconomicsService } from './services/marketplace-economics.service';
import { LtvCacCalculatorService } from './services/ltv-cac-calculator.service';
import { UnitEconomicsService } from './services/unit-economics.service';

describe('UnitEconomicsModule Services', () => {
  let economicsService: MarketplaceEconomicsService;
  let ltvCacService: LtvCacCalculatorService;
  let marginService: UnitEconomicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplaceEconomicsService, LtvCacCalculatorService, UnitEconomicsService],
    }).compile();

    economicsService = module.get<MarketplaceEconomicsService>(MarketplaceEconomicsService);
    ltvCacService = module.get<LtvCacCalculatorService>(LtvCacCalculatorService);
    marginService = module.get<UnitEconomicsService>(UnitEconomicsService);
  });

  it('should calculate GMV, Net Revenue, Take Rate, and AOV correctly', () => {
    const res = economicsService.getExecutiveRevenueMetrics();
    expect(res.gmvUsd).toBe(1250000.0);
    expect(res.netRevenueUsd).toBe(187500.0);
    expect(res.takeRatePct).toBe(15.0);
    expect(res.aovUsd).toBe(125.0);
  });

  it('should calculate LTV, LTV:CAC ratio, and Payback period', () => {
    const res = ltvCacService.calculateLtvCacMetrics(50, 30, 80, 4);
    expect(res.ltvUsd).toBe(600);
    expect(res.ltvToCacRatio).toBe(12);
    expect(res.paybackPeriodMonths).toBe(2.1);
  });

  it('should calculate gross margin and contribution margin percentages', () => {
    const res = marginService.calculateContributionMargin(100000, 15000, 20000, 5000);
    expect(res.grossMarginPct).toBe(85);
    expect(res.contributionMarginUsd).toBe(60000);
    expect(res.contributionMarginPct).toBe(60);
  });
});
