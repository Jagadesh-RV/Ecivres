import { Injectable } from '@nestjs/common';

export interface EarningsRecommendation {
  providerId: string;
  potentialEarningsIncreaseMonthly: number;
  recommendedActions: { title: string; impact: string; category: string }[];
}

@Injectable()
export class EarningsBoosterService {
  async getEarningsOptimization(providerId: string): Promise<EarningsRecommendation> {
    return {
      providerId,
      potentialEarningsIncreaseMonthly: 840,
      recommendedActions: [
        {
          title: 'Open 2 Peak Weekend Afternoon Slots',
          impact: '+$420 / month',
          category: 'SCHEDULE_OPTIMIZATION',
        },
        {
          title: 'Add Emergency Dispatch Badge',
          impact: '+$270 / month',
          category: 'HIGH_DEMAND_BADGE',
        },
        {
          title: 'Bundle AC Filter Replacement with Cleaning',
          impact: '+$150 / month',
          category: 'CROSS_SELL_SERVICE',
        },
      ],
    };
  }
}
