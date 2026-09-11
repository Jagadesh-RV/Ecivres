import { Injectable } from '@nestjs/common';

export interface CustomerMission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardPoints: number;
  isCompleted: boolean;
  type: 'BOOKING_COUNT' | 'REFERRAL_STREAK' | 'REVIEW_SERIES' | 'SEASONAL';
}

@Injectable()
export class CustomerMissionsService {
  private userMissions: Map<string, CustomerMission[]> = new Map();

  async getActiveMissions(userId: string): Promise<CustomerMission[]> {
    if (!this.userMissions.has(userId)) {
      this.userMissions.set(userId, [
        {
          id: 'm1',
          title: 'Spring Home Refresh',
          description: 'Book 2 cleaning or maintenance services this month',
          targetCount: 2,
          currentCount: 1,
          rewardPoints: 500,
          isCompleted: false,
          type: 'SEASONAL',
        },
        {
          id: 'm2',
          title: 'Viral Advocate',
          description: 'Successfully refer 3 friends to EcivreS',
          targetCount: 3,
          currentCount: 2,
          rewardPoints: 1000,
          isCompleted: false,
          type: 'REFERRAL_STREAK',
        },
        {
          id: 'm3',
          title: 'Community Feedback',
          description: 'Leave 3 detailed reviews with photos',
          targetCount: 3,
          currentCount: 3,
          rewardPoints: 300,
          isCompleted: true,
          type: 'REVIEW_SERIES',
        },
      ]);
    }

    return this.userMissions.get(userId) || [];
  }

  async claimMissionReward(userId: string, missionId: string): Promise<{ claimed: boolean; pointsAwarded: number }> {
    const missions = await this.getActiveMissions(userId);
    const mission = missions.find((m) => m.id === missionId);

    if (!mission || !mission.isCompleted) {
      return { claimed: false, pointsAwarded: 0 };
    }

    return { claimed: true, pointsAwarded: mission.rewardPoints };
  }
}
