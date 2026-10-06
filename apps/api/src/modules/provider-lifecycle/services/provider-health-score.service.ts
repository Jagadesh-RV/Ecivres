import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProviderHealthScoreService {
  private readonly logger = new Logger(ProviderHealthScoreService.name);

  calculateHealthScore(providerId: string, rating: number, responseRatePct: number, completionRatePct: number) {
    this.logger.log(`Calculating health score for provider ${providerId}`);
    const ratingWeight = (rating / 5) * 40;
    const responseWeight = (responseRatePct / 100) * 30;
    const completionWeight = (completionRatePct / 100) * 30;

    const overallScore = Math.round(ratingWeight + responseWeight + completionWeight);

    return {
      providerId,
      overallScore,
      rating,
      responseRatePct,
      completionRatePct,
      tier: overallScore >= 90 ? 'PLATINUM' : overallScore >= 75 ? 'GOLD' : overallScore >= 60 ? 'SILVER' : 'NEEDS_IMPROVEMENT',
    };
  }
}
