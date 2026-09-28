import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpansionAnalyticsService } from './services/expansion-analytics.service';

describe('ExpansionAnalyticsService', () => {
  let service: ExpansionAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpansionAnalyticsService],
    }).compile();

    service = module.get<ExpansionAnalyticsService>(ExpansionAnalyticsService);
  });

  it('should return global expansion overview across 5 markets', () => {
    const res = service.getGlobalExpansionOverview();
    expect(res.activeCountriesCount).toBe(5);
    expect(res.totalGlobalGmvUsd).toBeGreaterThan(0);
  });

  it('should return compliance health report for India (IN)', () => {
    const res = service.getComplianceHealthReport('IN');
    expect(res.countryCode).toBe('IN');
    expect(res.taxFilingStatus).toBe('UP_TO_DATE');
  });
});
