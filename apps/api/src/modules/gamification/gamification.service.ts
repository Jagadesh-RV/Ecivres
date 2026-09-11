import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CustomerGamificationProfile {
  userId: string;
  points: number;
  streakDays: number;
  vipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM_VIP';
  badges: { id: string; name: string; icon: string; unlockedAt: Date }[];
  nextTierPointsNeeded: number;
}

export interface LeaderboardEntry {
  providerId: string;
  providerName: string;
  monthlyCompletedBookings: number;
  averageRating: number;
  badgeTitle: string;
  rank: number;
}

@Injectable()
export class GamificationService {
  private userPoints: Map<string, number> = new Map();
  private userStreaks: Map<string, number> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async awardPointsForBooking(userId: string, totalAmount: number): Promise<CustomerGamificationProfile> {
    const currentPoints = this.userPoints.get(userId) || 0;
    const earned = Math.floor(totalAmount * 10); // 10 points per $1 spent
    const newPoints = currentPoints + earned;
    this.userPoints.set(userId, newPoints);

    // Update streak
    const currentStreak = (this.userStreaks.get(userId) || 0) + 1;
    this.userStreaks.set(userId, currentStreak);

    return this.getGamificationProfile(userId);
  }

  async getGamificationProfile(userId: string): Promise<CustomerGamificationProfile> {
    const points = this.userPoints.get(userId) || 1200;
    const streakDays = this.userStreaks.get(userId) || 4;

    let vipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM_VIP' = 'BRONZE';
    let nextTierPointsNeeded = 2000 - points;

    if (points >= 5000) {
      vipTier = 'PLATINUM_VIP';
      nextTierPointsNeeded = 0;
    } else if (points >= 2500) {
      vipTier = 'GOLD';
      nextTierPointsNeeded = 5000 - points;
    } else if (points >= 1000) {
      vipTier = 'SILVER';
      nextTierPointsNeeded = 2500 - points;
    }

    return {
      userId,
      points,
      streakDays,
      vipTier,
      badges: [
        { id: 'b1', name: 'First Booking', icon: '🎉', unlockedAt: new Date() },
        { id: 'b2', name: 'Home Care Pro', icon: '🏡', unlockedAt: new Date() },
      ],
      nextTierPointsNeeded: Math.max(0, nextTierPointsNeeded),
    };
  }

  async getTopProviderLeaderboard(): Promise<LeaderboardEntry[]> {
    return [
      {
        providerId: 'prov_1',
        providerName: 'Marcus Vance',
        monthlyCompletedBookings: 42,
        averageRating: 4.98,
        badgeTitle: '🥇 Top Rated Master',
        rank: 1,
      },
      {
        providerId: 'prov_2',
        providerName: 'Elena Rostova',
        monthlyCompletedBookings: 38,
        averageRating: 4.95,
        badgeTitle: '🥈 Speed Specialist',
        rank: 2,
      },
      {
        providerId: 'prov_3',
        providerName: 'David Sterling',
        monthlyCompletedBookings: 34,
        averageRating: 4.91,
        badgeTitle: '🥉 Customer Favorite',
        rank: 3,
      },
    ];
  }
}
