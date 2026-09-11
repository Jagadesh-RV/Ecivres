import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProviderBusinessAnalytics {
  providerId: string;
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  occupancyRate: number; // percentage
  peakHours: { hour: number; count: number }[];
  revenueForecastNextMonth: number;
  retentionRate: number; // percentage
  cancellationRate: number; // percentage
  aiInsights: string[];
}

@Injectable()
export class ProviderAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessAnalytics(providerId: string): Promise<ProviderBusinessAnalytics> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch bookings for this provider
    const bookings = await this.prisma.booking.findMany({
      where: { providerId },
      include: { review: true },
    });

    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

    const dailyEarnings = completedBookings
      .filter((b) => b.createdAt >= startOfDay)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const weeklyEarnings = completedBookings
      .filter((b) => b.createdAt >= startOfWeek)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const monthlyEarnings = completedBookings
      .filter((b) => b.createdAt >= startOfMonth)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Calculate peak hours
    const hourCounts: Record<number, number> = {};
    completedBookings.forEach((b) => {
      const hour = new Date(b.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: Number(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const totalCount = bookings.length || 1;
    const cancellationRate = Math.round((cancelledBookings.length / totalCount) * 100);
    const occupancyRate = Math.min(100, Math.round((completedBookings.length / (totalCount * 0.8 || 1)) * 100));

    // Revenue forecasting: projected 15% growth if occupancy > 70%
    const growthFactor = occupancyRate > 70 ? 1.15 : 1.05;
    const revenueForecastNextMonth = Math.round(monthlyEarnings * growthFactor);

    const aiInsights: string[] = [];
    if (peakHours.length > 0) {
      aiInsights.push(`Your peak demand occurs around ${peakHours[0].hour}:00. Consider opening extra slots.`);
    }
    if (cancellationRate > 15) {
      aiInsights.push(`Cancellation rate is ${cancellationRate}%. Enable automated reminders to reduce dropouts.`);
    } else {
      aiInsights.push(`Great job! Your cancellation rate is low (${cancellationRate}%).`);
    }

    return {
      providerId,
      dailyEarnings,
      weeklyEarnings,
      monthlyEarnings,
      occupancyRate,
      peakHours,
      revenueForecastNextMonth,
      retentionRate: 84, // percentage benchmark
      cancellationRate,
      aiInsights,
    };
  }
}
