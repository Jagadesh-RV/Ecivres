import { Injectable, Logger } from '@nestjs/common';

export interface ActivationProgress {
  userId: string;
  hasCompletedProfile: boolean;
  hasPerformedSearch: boolean;
  hasCompletedFirstBooking: boolean;
  hasMadeFirstPayment: boolean;
  activationScorePercent: number;
}

@Injectable()
export class CustomerActivationService {
  private readonly logger = new Logger(CustomerActivationService.name);
  private readonly activationMap = new Map<string, ActivationProgress>();

  getActivationStatus(userId: string): ActivationProgress {
    const existing = this.activationMap.get(userId);
    if (existing) return existing;

    const initial: ActivationProgress = {
      userId,
      hasCompletedProfile: false,
      hasPerformedSearch: false,
      hasCompletedFirstBooking: false,
      hasMadeFirstPayment: false,
      activationScorePercent: 0,
    };
    this.activationMap.set(userId, initial);
    return initial;
  }

  updateMilestone(userId: string, milestone: keyof Omit<ActivationProgress, 'userId' | 'activationScorePercent'>) {
    const current = this.getActivationStatus(userId);
    current[milestone] = true;

    let score = 0;
    if (current.hasCompletedProfile) score += 25;
    if (current.hasPerformedSearch) score += 25;
    if (current.hasCompletedFirstBooking) score += 25;
    if (current.hasMadeFirstPayment) score += 25;
    current.activationScorePercent = score;

    this.activationMap.set(userId, current);
    this.logger.log(`Updated activation milestone '${milestone}' for user ${userId}. New score: ${score}%`);
    return current;
  }
}
