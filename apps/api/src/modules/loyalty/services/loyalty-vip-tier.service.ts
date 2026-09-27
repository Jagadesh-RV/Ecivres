import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoyaltyVipTierService {
  private readonly logger = new Logger(LoyaltyVipTierService.name);

  calculateVipTier(totalSpendUsd: number, totalBookingsCount: number): { tier: string; cashbackRatePercent: number } {
    if (totalSpendUsd >= 5000 || totalBookingsCount >= 50) {
      return { tier: 'DIAMOND', cashbackRatePercent: 10.0 };
    }
    if (totalSpendUsd >= 2000 || totalBookingsCount >= 20) {
      return { tier: 'PLATINUM', cashbackRatePercent: 7.5 };
    }
    if (totalSpendUsd >= 500 || totalBookingsCount >= 5) {
      return { tier: 'GOLD', cashbackRatePercent: 5.0 };
    }
    return { tier: 'BRONZE', cashbackRatePercent: 2.0 };
  }

  evaluateBirthdayReward(userBirthMonthDay: string, currentMonthDay: string, vipTier: string) {
    const isBirthday = userBirthMonthDay === currentMonthDay;
    let rewardCouponUsd = 0;

    if (isBirthday) {
      if (vipTier === 'DIAMOND') rewardCouponUsd = 50;
      else if (vipTier === 'PLATINUM') rewardCouponUsd = 30;
      else if (vipTier === 'GOLD') rewardCouponUsd = 20;
      else rewardCouponUsd = 10;
    }

    this.logger.log(`Birthday evaluation for ${vipTier}: Eligible=${isBirthday} Reward=$${rewardCouponUsd}`);
    return { isBirthday, rewardCouponUsd };
  }

  generateSurpriseReward(bookingMilestoneCount: number) {
    const isSurprise = bookingMilestoneCount % 10 === 0;
    const surpriseBonusUsd = isSurprise ? 25.0 : 0.0;
    this.logger.log(`Surprise reward evaluation for milestone ${bookingMilestoneCount}: Triggered=${isSurprise}`);
    return { isSurprise, surpriseBonusUsd };
  }
}
