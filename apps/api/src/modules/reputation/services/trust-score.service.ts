import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TrustScoreService {
  private readonly logger = new Logger(TrustScoreService.name);

  calculateTrustScore(identityVerified: boolean, averageRating: number, totalJobsCompleted: number, cancellationRatePercent: number) {
    let score = 50; // Base score

    if (identityVerified) score += 20;
    score += (averageRating / 5.0) * 20; // Up to 20 points
    score += Math.min(totalJobsCompleted * 0.1, 10); // Up to 10 points
    score -= cancellationRatePercent * 2; // Penalty for cancellations

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    this.logger.log(`Calculated Trust Score: ${finalScore}/100`);

    return {
      identityVerified,
      averageRating,
      totalJobsCompleted,
      cancellationRatePercent,
      trustScore: finalScore,
    };
  }

  evaluateVerifiedBadges(trustScore: number, backgroundCheckPassed: boolean, insuranceActive: boolean) {
    const badges: string[] = [];

    if (backgroundCheckPassed) badges.push('BACKGROUND_VERIFIED');
    if (insuranceActive) badges.push('INSURED_PROVIDER');
    if (trustScore >= 90) badges.push('TOP_RATED_ELITE');

    this.logger.log(`Assigned Verified Badges: [${badges.join(', ')}]`);
    return { trustScore, badges };
  }
}
