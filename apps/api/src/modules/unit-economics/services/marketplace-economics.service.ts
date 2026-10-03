import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MarketplaceEconomicsService {
  private readonly logger = new Logger(MarketplaceEconomicsService.name);

  getExecutiveRevenueMetrics() {
    this.logger.log('Calculating executive marketplace revenue metrics');
    const gmvUsd = 1250000.0;
    const takeRatePct = 15.0;
    const netRevenueUsd = (gmvUsd * takeRatePct) / 100;
    const totalOrders = 10000;
    const aovUsd = gmvUsd / totalOrders;

    return {
      gmvUsd,
      netRevenueUsd,
      takeRatePct,
      totalOrders,
      aovUsd,
    };
  }
}
