import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UnitEconomicsService {
  private readonly logger = new Logger(UnitEconomicsService.name);

  calculateContributionMargin(revenueUsd: number, cogsUsd: number, variableMarketingUsd: number, paymentProcessingUsd: number) {
    this.logger.log(`Calculating contribution margin on revenue $${revenueUsd}`);
    const grossProfit = revenueUsd - cogsUsd;
    const grossMarginPct = revenueUsd > 0 ? (grossProfit / revenueUsd) * 100 : 0;

    const totalVariableCosts = cogsUsd + variableMarketingUsd + paymentProcessingUsd;
    const contributionMarginUsd = revenueUsd - totalVariableCosts;
    const contributionMarginPct = revenueUsd > 0 ? (contributionMarginUsd / revenueUsd) * 100 : 0;

    return {
      revenueUsd,
      grossProfitUsd: grossProfit,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      contributionMarginUsd,
      contributionMarginPct: Math.round(contributionMarginPct * 10) / 10,
    };
  }
}
