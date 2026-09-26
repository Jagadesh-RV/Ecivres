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
}
