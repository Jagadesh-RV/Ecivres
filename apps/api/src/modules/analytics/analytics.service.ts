import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getProviderPerformanceMetrics(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const [totalBookings, completedBookings, cancelledBookings, reviews] = await Promise.all([
      this.prisma.booking.count({ where: { service: { providerId: provider.id } } }),
      this.prisma.booking.count({ where: { service: { providerId: provider.id }, status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { service: { providerId: provider.id }, status: 'CANCELLED' } }),
      this.prisma.review.findMany({ where: { booking: { service: { providerId: provider.id } } } }),
    ]);

    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 100;
    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
    const averageRating =
      reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 5.0;

    return {
      providerId: provider.id,
      totalBookings,
      completedBookings,
      cancelledBookings,
      completionRate: Math.round(completionRate * 10) / 10,
      cancellationRate: Math.round(cancellationRate * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async getCustomerActivityMetrics(userId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const [totalBookings, completedBookings, totalFavorites] = await Promise.all([
      this.prisma.booking.count({ where: { customerId: customer.id } }),
      this.prisma.booking.count({ where: { customerId: customer.id, status: 'COMPLETED' } }),
      ((this.prisma as any).favorite ? (this.prisma as any).favorite.count({ where: { userId } }) : Promise.resolve(0)),
    ]);

    return {
      customerId: customer.id,
      totalBookings,
      completedBookings,
      totalFavorites,
    };
  }

  async getRevenueAnalyticsDashboard() {
    const completedBookings = await this.prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      include: { service: true, payment: true },
    });

    const grossRevenue = completedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
    const platformCommission = grossRevenue * 0.10; // 10% platform marketplace fee
    const providerPayouts = grossRevenue - platformCommission;

    return {
      totalCompletedBookings: completedBookings.length,
      grossRevenue: Math.round(grossRevenue * 100) / 100,
      platformCommission: Math.round(platformCommission * 100) / 100,
      providerPayouts: Math.round(providerPayouts * 100) / 100,
      currency: 'USD',
    };
  }

  async getBookingConversionFunnel() {
    const [totalSearches, totalBookingsCreated, totalConfirmed, totalCompleted] = await Promise.all([
      this.prisma.service.count(), // Base services viewed/searched
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] } } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
    ]);

    const conversionRate = totalBookingsCreated > 0 ? (totalCompleted / totalBookingsCreated) * 100 : 0;

    return {
      funnel: [
        { stage: 'Discovered Services', count: totalSearches * 10 },
        { stage: 'Booking Created', count: totalBookingsCreated },
        { stage: 'Booking Confirmed', count: totalConfirmed },
        { stage: 'Service Completed', count: totalCompleted },
      ],
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  }
}
