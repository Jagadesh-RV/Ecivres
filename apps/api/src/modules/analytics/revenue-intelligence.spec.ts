import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';

describe('RevenueIntelligenceService', () => {
  let service: RevenueIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenueIntelligenceService],
    }).compile();

    service = module.get<RevenueIntelligenceService>(RevenueIntelligenceService);
  });

  it('should calculate GMV, MRR, ARR executive metrics correctly', () => {
    const res = service.calculateExecutiveRevenueMetrics(100000, 15.0, 1000, 30.0);
    expect(res.mrrUsd).toBe(45000); // (100k * 15%) + (1000 * 30) = 15k + 30k = 45k
    expect(res.arrUsd).toBe(540000); // 45k * 12 = 540k
  });

  it('should calculate Customer LTV accurately', () => {
    const res = service.calculateCustomerLtv(100, 6, 3, 65); // 100 * 6 * 3 * 0.65 = 1170
    expect(res.ltvUsd).toBe(1170.0);
  });

  it('should predict HIGH churn risk score for dormant user with low rating', () => {
    const res = service.predictCustomerChurnRisk(100, 5, 2.0);
    expect(res.riskLevel).toBe('HIGH');
    expect(res.churnRiskScore).toBeGreaterThanOrEqual(70);
  });
});
