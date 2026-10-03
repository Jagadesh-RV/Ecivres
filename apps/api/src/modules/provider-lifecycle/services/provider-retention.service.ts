import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProviderRetentionService {
  private readonly logger = new Logger(ProviderRetentionService.name);

  assessChurnRisk(providerId: string, daysInactive: number, cancellationCount: number) {
    this.logger.log(`Evaluating churn risk for provider ${providerId}`);
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    if (daysInactive > 60 || cancellationCount > 5) {
      riskLevel = 'CRITICAL';
    } else if (daysInactive > 30 || cancellationCount > 2) {
      riskLevel = 'HIGH';
    } else if (daysInactive > 14) {
      riskLevel = 'MEDIUM';
    }

    const recommendations: string[] = [];
    if (daysInactive > 14) recommendations.push('Set up upcoming availability slots');
    if (cancellationCount > 0) recommendations.push('Review schedule buffer times to prevent cancellations');
    recommendations.push('Upload high-quality portfolio images to attract bookings');

    return {
      providerId,
      daysInactive,
      churnRiskLevel: riskLevel, // Internal operational metric
      recommendations,
    };
  }
}
