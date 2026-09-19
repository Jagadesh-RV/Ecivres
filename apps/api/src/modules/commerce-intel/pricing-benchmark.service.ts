import { Injectable } from '@nestjs/common';

export interface CompetitorBenchmarkResult {
  category: string;
  ecivresAveragePriceUsd: number;
  marketCompetitorAveragePriceUsd: number;
  pricePosition: 'BELOW_MARKET' | 'COMPETITIVE' | 'PREMIUM';
  recommendedOptimalPriceUsd: number;
}

@Injectable()
export class PricingBenchmarkService {
  getCompetitorBenchmark(category: string, currentPriceUsd: number): CompetitorBenchmarkResult {
    const marketAvg = Math.round(currentPriceUsd * 1.1); // Market avg 10% higher
    let pricePosition: 'BELOW_MARKET' | 'COMPETITIVE' | 'PREMIUM' = 'COMPETITIVE';

    if (currentPriceUsd < marketAvg * 0.9) {
      pricePosition = 'BELOW_MARKET';
    } else if (currentPriceUsd > marketAvg * 1.15) {
      pricePosition = 'PREMIUM';
    }

    return {
      category,
      ecivresAveragePriceUsd: currentPriceUsd,
      marketCompetitorAveragePriceUsd: marketAvg,
      pricePosition,
      recommendedOptimalPriceUsd: Math.round(marketAvg * 0.98),
    };
  }
}
