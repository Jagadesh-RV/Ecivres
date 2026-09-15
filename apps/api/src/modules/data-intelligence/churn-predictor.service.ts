import { Injectable, Logger } from '@nestjs/common';
import { ChurnAnalysisDto } from './dto/churn-analysis.dto';

export interface ChurnPredictionResult {
  customerId: string;
  churnProbabilityPercentage: number;
  riskTier: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedWinBackAction?: string;
  suggestedCouponDiscount?: number;
}

@Injectable()
export class ChurnPredictorService {
  private readonly logger = new Logger(ChurnPredictorService.name);

  async analyzeChurnRisk(dto: ChurnAnalysisDto): Promise<ChurnPredictionResult> {
    // Basic heuristic model: long inactivity increases churn probability
    let churnProb = Math.min(100, Math.round((dto.daysSinceLastBooking / 90) * 100));
    
    if (dto.totalHistoricalBookings > 10) {
      churnProb = Math.max(0, churnProb - 20);
    }

    let riskTier: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let recommendedWinBackAction: string | undefined;
    let suggestedCouponDiscount: number | undefined;

    if (churnProb >= 70) {
      riskTier = 'HIGH';
      recommendedWinBackAction = 'Send 25% OFF re-engagement promo push notification';
      suggestedCouponDiscount = 25;
    } else if (churnProb >= 40) {
      riskTier = 'MEDIUM';
      recommendedWinBackAction = 'Send personalized service recommendation email';
      suggestedCouponDiscount = 10;
    }

    return {
      customerId: dto.customerId,
      churnProbabilityPercentage: churnProb,
      riskTier,
      recommendedWinBackAction,
      suggestedCouponDiscount,
    };
  }
}
