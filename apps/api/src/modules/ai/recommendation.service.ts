import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RecommendationQueryDto, RecommendedProviderResponseDto } from './dto/recommendation.dto';

export interface ScoringFactors {
  ratingScore: number;
  completionScore: number;
  responseTimeScore: number;
  distanceScore: number;
  repeatCustomerScore: number;
}

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates composite provider score based on:
   * - rating (weight: 0.30)
   * - completion rate (weight: 0.25)
   * - response time (weight: 0.15)
   * - distance (weight: 0.15)
   * - repeat customers (weight: 0.15)
   */
  calculateProviderScore(
    avgRating: number,
    completedBookings: number,
    totalBookings: number,
    avgResponseMinutes: number,
    distanceKm: number | null,
    repeatCustomerRatio: number,
  ): { finalScore: number; breakdown: ScoringFactors } {
    // 1. Rating Score (0 to 1)
    const ratingScore = avgRating > 0 ? Math.min(avgRating / 5.0, 1.0) : 0.7;

    // 2. Completion Rate Score (0 to 1)
    const completionRate = totalBookings > 0 ? completedBookings / totalBookings : 0.8;
    const completionScore = Math.min(Math.max(completionRate, 0), 1.0);

    // 3. Response Time Score (0 to 1)
    let responseTimeScore = 0.7;
    if (avgResponseMinutes > 0) {
      if (avgResponseMinutes <= 15) responseTimeScore = 1.0;
      else if (avgResponseMinutes <= 60) responseTimeScore = 0.85;
      else if (avgResponseMinutes <= 240) responseTimeScore = 0.65;
      else responseTimeScore = 0.4;
    }

    // 4. Distance Score (0 to 1)
    let distanceScore = 0.7;
    if (distanceKm !== null && !isNaN(distanceKm)) {
      distanceScore = Math.max(0, 1 - distanceKm / 50.0);
    }

    // 5. Repeat Customer Score (0 to 1)
    const repeatCustomerScore = Math.min(Math.max(repeatCustomerRatio, 0), 1.0);

    // Composite Weighted Sum
    const finalScore = Number(
      (
        ratingScore * 0.3 +
        completionScore * 0.25 +
        responseTimeScore * 0.15 +
        distanceScore * 0.15 +
        repeatCustomerScore * 0.15
      ).toFixed(4),
    );

    return {
      finalScore,
      breakdown: {
        ratingScore: Number(ratingScore.toFixed(2)),
        completionScore: Number(completionScore.toFixed(2)),
        responseTimeScore: Number(responseTimeScore.toFixed(2)),
        distanceScore: Number(distanceScore.toFixed(2)),
        repeatCustomerScore: Number(repeatCustomerScore.toFixed(2)),
      },
    };
  }

  async getRecommendedProviders(query: RecommendationQueryDto): Promise<RecommendedProviderResponseDto[]> {
    const providers = await this.prisma.providerProfile.findMany({
      where: query.categoryId
        ? { services: { some: { categoryId: query.categoryId } } }
        : undefined,
      include: {
        services: true,
        user: {
          include: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    const results = providers.map((provider) => {
      const reviews = provider.user?.reviews || [];
      const bookings = provider.user?.bookings || [];

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 4.5; // default fallback rating

      const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
      const totalBookings = bookings.length;

      // Calculate repeat customers ratio
      const customerCounts = new Map<string, number>();
      bookings.forEach((b) => {
        customerCounts.set(b.customerId, (customerCounts.get(b.customerId) || 0) + 1);
      });
      let repeatCount = 0;
      customerCounts.forEach((count) => {
        if (count > 1) repeatCount++;
      });
      const repeatCustomerRatio = customerCounts.size > 0 ? repeatCount / customerCounts.size : 0.3;

      // Distance score placeholder (calculated in task 4)
      const distanceKm: number | null = null;
      const avgResponseMinutes = 30; // standard mock baseline

      const { finalScore, breakdown } = this.calculateProviderScore(
        avgRating,
        completedBookings,
        totalBookings,
        avgResponseMinutes,
        distanceKm,
        repeatCustomerRatio,
      );

      return {
        providerId: provider.id,
        businessName: provider.businessName,
        isVerified: provider.isVerified,
        score: finalScore,
        breakdown,
        distanceKm: distanceKm || undefined,
        averageRating: Number(avgRating.toFixed(1)),
        completedBookingsCount: completedBookings,
      };
    });

    return results.sort((a, b) => b.score - a.score).slice(0, query.limit || 10);
  }
}
