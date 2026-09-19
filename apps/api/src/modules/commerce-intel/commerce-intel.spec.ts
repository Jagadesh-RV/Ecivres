import { Test, TestingModule } from '@nestjs/testing';
import { PricingBenchmarkService } from './pricing-benchmark.service';
import { RevenueSimulatorService } from './revenue-simulator.service';

describe('Commerce Intelligence Module Services', () => {
  let pricingBenchmark: PricingBenchmarkService;
  let revenueSimulator: RevenueSimulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingBenchmarkService, RevenueSimulatorService],
    }).compile();

    pricingBenchmark = module.get<PricingBenchmarkService>(PricingBenchmarkService);
    revenueSimulator = module.get<RevenueSimulatorService>(RevenueSimulatorService);
  });

  it('should calculate competitor price position and recommended optimal price', () => {
    const benchmark = pricingBenchmark.getCompetitorBenchmark('Plumbing', 200);
    expect(benchmark.ecivresAveragePriceUsd).toBe(200);
    expect(benchmark.marketCompetitorAveragePriceUsd).toBe(220); // 10% higher
    expect(benchmark.pricePosition).toBe('COMPETITIVE');
  });

  it('should run 12-month Monte Carlo revenue trajectory simulation', () => {
    const sim = revenueSimulator.simulateRevenue({
      category: 'HVAC Repair',
      currentMonthlyBookings: 200,
      averageTicketSizeUsd: 250,
      projectedGrowthRatePercentage: 20, // 1.2 growth
    });
    // 200 * 12 * 1.2 = 2880 bookings * $250 = $720,000 gross
    expect(sim.projectedAnnualGrossRevenueUsd).toBe(720000);
    expect(sim.projectedAnnualPlatformFeeUsd).toBe(108000); // 15% fee
    expect(sim.confidenceInterval95.minUsd).toBeLessThan(720000);
  });
});
