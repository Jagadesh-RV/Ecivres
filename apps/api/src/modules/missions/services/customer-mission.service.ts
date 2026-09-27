import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomerMissionService {
  private readonly logger = new Logger(CustomerMissionService.name);

  getDailyMissions(userId: string) {
    this.logger.log(`Fetching daily missions for user ${userId}`);
    return [
      { id: 'msn_1', title: 'Complete 1 Cleaning Booking', rewardPoints: 100, isCompleted: false },
      { id: 'msn_2', title: 'Leave a 5-Star Provider Review', rewardPoints: 50, isCompleted: true },
      { id: 'msn_3', title: 'Share Invite Link with 1 Friend', rewardPoints: 75, isCompleted: false },
    ];
  }

  evaluateBookingStreak(currentStreakConsecutiveMonths: number) {
    const isStreakBonusEligible = currentStreakConsecutiveMonths >= 3;
    const streakBonusUsd = isStreakBonusEligible ? 20.0 : 0.0;
    this.logger.log(`Evaluated ${currentStreakConsecutiveMonths}-month booking streak: Bonus=$${streakBonusUsd}`);
    return {
      currentStreakConsecutiveMonths,
      isStreakBonusEligible,
      streakBonusUsd,
    };
  }

  getUserBadges(userId: string) {
    this.logger.log(`Fetching achievement badges for user ${userId}`);
    return [
      { badgeId: 'bdg_early_adopter', title: 'Early Platform VIP', icon: 'star', unlockedAt: new Date().toISOString() },
      { badgeId: 'bdg_home_master', title: 'Master of Maintenance', icon: 'shield-check', unlockedAt: new Date().toISOString() },
    ];
  }
}
