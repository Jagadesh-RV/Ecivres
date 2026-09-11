import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CustomerInsights {
  customerId: string;
  lifetimeValue: number;
  avgOrderValue: number;
  totalBookingsCount: number;
  favoriteCategories: { categoryName: string; bookingCount: number }[];
  churnRiskScore: number; // 0 to 100
  churnRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedRetentionOffer?: string;
}

@Injectable()
export class AiCustomerInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerInsights(customerId: string): Promise<CustomerInsights> {
    const bookings = await this.prisma.booking.findMany({
      where: { customerId },
      include: { service: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalBookingsCount = bookings.length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED');
    const lifetimeValue = completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgOrderValue = totalBookingsCount > 0 ? Math.round(lifetimeValue / totalBookingsCount) : 0;

    // Calculate category preferences
    const categoryCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const catName = b.service?.category?.name || 'General Services';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });

    const favoriteCategories = Object.entries(categoryCounts)
      .map(([categoryName, bookingCount]) => ({ categoryName, bookingCount }))
      .sort((a, b) => b.bookingCount - a.bookingCount);

    // Churn Risk calculation based on recency of last booking
    const lastBooking = bookings[0];
    let daysSinceLastBooking = 30;
    if (lastBooking) {
      const diffMs = Date.now() - new Date(lastBooking.createdAt).getTime();
      daysSinceLastBooking = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    let churnRiskScore = Math.min(100, Math.max(5, Math.floor(daysSinceLastBooking * 1.5)));
    let churnRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    if (churnRiskScore > 70) {
      churnRiskLevel = 'HIGH';
    } else if (churnRiskScore > 40) {
      churnRiskLevel = 'MEDIUM';
    }

    let recommendedRetentionOffer: string | undefined;
    if (churnRiskLevel === 'HIGH') {
      recommendedRetentionOffer = '20% off your next booking with code WE_MISS_YOU';
    } else if (churnRiskLevel === 'MEDIUM') {
      recommendedRetentionOffer = 'Free priority scheduling on your next request';
    }

    return {
      customerId,
      lifetimeValue,
      avgOrderValue,
      totalBookingsCount,
      favoriteCategories,
      churnRiskScore,
      churnRiskLevel,
      recommendedRetentionOffer,
    };
  }
}
