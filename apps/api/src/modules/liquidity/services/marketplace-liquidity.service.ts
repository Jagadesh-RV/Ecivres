import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MarketplaceLiquidityService {
  private readonly logger = new Logger(MarketplaceLiquidityService.name);

  getCategoryLiquidity(category: string, city: string) {
    this.logger.log(`Evaluating category liquidity for ${category} in ${city}`);
    const activeProviders = 42;
    const searchVolume = 1200;
    const bookingCount = 380;

    if (searchVolume === 0) {
      return { category, city, status: 'INSUFFICIENT_DATA' };
    }

    const conversionRate = (bookingCount / searchVolume) * 100;
    const supplyDemandRatio = activeProviders / (bookingCount || 1);

    return {
      category,
      city,
      status: 'LIQUID',
      activeProviders,
      searchVolume,
      bookingCount,
      conversionRatePercent: Math.round(conversionRate * 10) / 10,
      supplyDemandRatio: Math.round(supplyDemandRatio * 100) / 100,
    };
  }
}
