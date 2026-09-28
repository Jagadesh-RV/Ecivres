import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExpansionAnalyticsService {
  private readonly logger = new Logger(ExpansionAnalyticsService.name);

  getGlobalExpansionOverview() {
    this.logger.log('Fetching global expansion analytics overview across active markets');
    return {
      activeCountriesCount: 5,
      countries: [
        { code: 'US', name: 'United States', status: 'ACTIVE', providerDensityCount: 4200, mrrUsd: 185000, complianceScore: 99.5 },
        { code: 'IN', name: 'India', status: 'ACTIVE', providerDensityCount: 8500, mrrUsd: 120000, complianceScore: 98.2 },
        { code: 'GB', name: 'United Kingdom', status: 'ACTIVE', providerDensityCount: 1900, mrrUsd: 65000, complianceScore: 99.8 },
        { code: 'AE', name: 'United Arab Emirates', status: 'ACTIVE', providerDensityCount: 1100, mrrUsd: 45000, complianceScore: 99.0 },
        { code: 'DE', name: 'Germany', status: 'ACTIVE', providerDensityCount: 1400, mrrUsd: 55000, complianceScore: 99.1 },
      ],
      totalGlobalGmvUsd: 3100000,
      totalGlobalMrrUsd: 470000,
    };
  }
}
