import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MarketplaceHealthService {
  private readonly logger = new Logger(MarketplaceHealthService.name);

  getMarketplaceHealthOverview() {
    this.logger.log('Calculating global marketplace health metrics');
    return {
      activeCustomersCount: 14200,
      activeProvidersCount: 1850,
      searchToBookingConversionPercent: 28.4,
      bookingAcceptanceRatePercent: 94.2,
      providerResponseRatePercent: 96.8,
      averageResponseTimeSeconds: 145,
      cancellationRatePercent: 2.1,
      completionRatePercent: 97.9,
      repeatBookingRatePercent: 41.5,
      overallHealthScore: 'OPTIMAL',
    };
  }
}
