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

  calculateCustomerLtv(averageOrderValueUsd: number, annualPurchaseFrequency: number, averageLifespanYears: number, grossMarginPercent = 65.0) {
    const ltvUsd = averageOrderValueUsd * annualPurchaseFrequency * averageLifespanYears * (grossMarginPercent / 100);
    this.logger.log(`Calculated Customer LTV: $${ltvUsd.toFixed(2)} USD`);
    return {
      averageOrderValueUsd,
      annualPurchaseFrequency,
      averageLifespanYears,
      grossMarginPercent,
      ltvUsd: Number(ltvUsd.toFixed(2)),
    };
  }

  predictCustomerChurnRisk(daysSinceLastBooking: number, supportTicketsCount: number, averageRatingGiven: number) {
    let churnRiskScore = 10; // Low churn

    if (daysSinceLastBooking > 90) churnRiskScore += 50;
    else if (daysSinceLastBooking > 45) churnRiskScore += 25;

    if (supportTicketsCount > 3) churnRiskScore += 30;
    if (averageRatingGiven < 3.5) churnRiskScore += 30;

    const riskLevel = churnRiskScore >= 70 ? 'HIGH' : churnRiskScore >= 40 ? 'MEDIUM' : 'LOW';
    this.logger.warn(`Predicted customer churn risk: ${riskLevel} (${churnRiskScore} pts)`);

    return {
      daysSinceLastBooking,
      supportTicketsCount,
      averageRatingGiven,
      churnRiskScore,
      riskLevel,
    };
  }
}
