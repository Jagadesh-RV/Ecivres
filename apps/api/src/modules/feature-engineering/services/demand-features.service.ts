import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface DemandFeatures {
  bookingsCount: number;
  bookingsPerHour: number;
  bookingAccelerationPct: number;
  categoryGrowthPct: number;
  geographicDemandDensity: number;
  cancellationRatePct: number;
}

@Injectable()
export class DemandFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateDemandFeatures(region: string = 'GLOBAL', category?: string): Promise<DemandFeatures> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const whereCurrent: any = { createdAt: { gte: oneDayAgo } };
    const wherePrevious: any = { createdAt: { gte: twoDaysAgo, lt: oneDayAgo } };

    if (category) {
      whereCurrent.categoryId = category;
      wherePrevious.categoryId = category;
    }

    const [currentBookings, prevBookings, cancelledBookings] = await Promise.all([
      this.prisma.booking.count({ where: whereCurrent }),
      this.prisma.booking.count({ where: wherePrevious }),
      this.prisma.booking.count({
        where: { ...whereCurrent, status: 'CANCELLED' },
      }),
    ]);

    const bookingsPerHour = Number((currentBookings / 24).toFixed(2));
    const acceleration = prevBookings > 0
      ? Number((((currentBookings - prevBookings) / prevBookings) * 100).toFixed(2))
      : 0;

    const cancellationRate = currentBookings > 0
      ? Number(((cancelledBookings / currentBookings) * 100).toFixed(2))
      : 0;

    return {
      bookingsCount: currentBookings,
      bookingsPerHour,
      bookingAccelerationPct: acceleration,
      categoryGrowthPct: acceleration,
      geographicDemandDensity: Number((currentBookings / 100).toFixed(2)),
      cancellationRatePct: cancellationRate,
    };
  }
}
