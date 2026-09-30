import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SupplyDemandAnalyticsService {
  private readonly logger = new Logger(SupplyDemandAnalyticsService.name);

  getSupplyDemandRatio(region: string) {
    this.logger.log(`Analyzing supply vs demand ratio for region ${region}`);
    if (region.toLowerCase() === 'empty') {
      return { region, status: 'INSUFFICIENT_DATA' };
    }
    return {
      region,
      status: 'HEALTHY',
      activeCustomers: 1850,
      activeProviders: 240,
      unfulfilledSearchRequests: 18,
      peakDemandWindow: '14:00 - 18:00 EST',
      supplyDemandRatio: 0.13,
    };
  }
}
