import { Injectable, Logger } from '@nestjs/common';

export interface ProviderActivationProgress {
  providerId: string;
  verificationCompleted: boolean;
  serviceCreated: boolean;
  portfolioCompleted: boolean;
  availabilitySetup: boolean;
  firstBookingCompleted: boolean;
  firstPayoutReceived: boolean;
  activationScorePercent: number;
}

@Injectable()
export class ProviderActivationService {
  private readonly logger = new Logger(ProviderActivationService.name);
  private readonly providerMap = new Map<string, ProviderActivationProgress>();

  getActivationProgress(providerId: string): ProviderActivationProgress {
    const existing = this.providerMap.get(providerId);
    if (existing) return existing;

    const initial: ProviderActivationProgress = {
      providerId,
      verificationCompleted: false,
      serviceCreated: false,
      portfolioCompleted: false,
      availabilitySetup: false,
      firstBookingCompleted: false,
      firstPayoutReceived: false,
      activationScorePercent: 0,
    };
    this.providerMap.set(providerId, initial);
    return initial;
  }

  updateMilestone(providerId: string, milestone: keyof Omit<ProviderActivationProgress, 'providerId' | 'activationScorePercent'>) {
    const current = this.getActivationProgress(providerId);
    current[milestone] = true;

    let completed = 0;
    const fields: (keyof Omit<ProviderActivationProgress, 'providerId' | 'activationScorePercent'>)[] = [
      'verificationCompleted', 'serviceCreated', 'portfolioCompleted', 'availabilitySetup', 'firstBookingCompleted', 'firstPayoutReceived'
    ];
    fields.forEach((f) => { if (current[f]) completed++; });

    current.activationScorePercent = Math.round((completed / fields.length) * 100);
    this.providerMap.set(providerId, current);
    this.logger.log(`Updated provider ${providerId} milestone '${milestone}'. Activation: ${current.activationScorePercent}%`);
    return current;
  }
}
