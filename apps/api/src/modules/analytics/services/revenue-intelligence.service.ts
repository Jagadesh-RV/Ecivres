import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RevenueIntelligenceService {
  private readonly logger = new Logger(RevenueIntelligenceService.name);

  calculateExecutiveRevenueMetrics(monthlyGmvUsd: number, takeRatePercent = 15.0, activeSubscriptionsCount = 1200, subscriptionPriceUsd = 29.0) {
    const mrrUsd = (monthlyGmvUsd * (takeRatePercent / 100)) + (activeSubscriptionsCount * subscriptionPriceUsd);
    const arrUsd = mrrUsd * 12;
    this.logger.log(`Calculated Executive Metrics: GMV=$${monthlyGmvUsd} MRR=$${mrrUsd} ARR=$${arrUsd}`);
    return {
      monthlyGmvUsd,
      takeRatePercent,
      mrrUsd,
      arrUsd,
    };
  }
}
