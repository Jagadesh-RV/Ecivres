import { Test, TestingModule } from '@nestjs/testing';
import { ChurnPredictorService } from './churn-predictor.service';

describe('ChurnPredictorService', () => {
  let service: ChurnPredictorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChurnPredictorService],
    }).compile();

    service = module.get<ChurnPredictorService>(ChurnPredictorService);
  });

  it('should score high churn risk for customers inactive > 75 days', async () => {
    const result = await service.analyzeChurnRisk({
      customerId: 'cust_inactive',
      daysSinceLastBooking: 85,
      totalHistoricalBookings: 2,
    });

    expect(result.riskTier).toBe('HIGH');
    expect(result.churnProbabilityPercentage).toBeGreaterThanOrEqual(70);
    expect(result.recommendedWinBackAction).toBeDefined();
  });
});
