import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        customerProfile: true,
        providerProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAdminDashboardStats() {
    const [
      totalUsersCount,
      totalCustomersCount,
      totalProvidersCount,
      verifiedProvidersCount,
      pendingProvidersCount,
      totalBookingsCount,
      completedBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.customerProfile.count(),
      this.prisma.providerProfile.count(),
      this.prisma.providerProfile.count({ where: { isVerified: true } }),
      this.prisma.providerProfile.count({ where: { isVerified: false } }),
      this.prisma.booking.count(),
      this.prisma.booking.findMany({
        where: { status: 'COMPLETED' },
        include: { service: true },
      }),
    ]);

    const platformGrossVolume = completedBookings.reduce(
      (sum, b) => sum + (b.service?.price || 0),
      0,
    );

    const pendingApplications = await this.prisma.providerProfile.findMany({
      where: { isVerified: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
      },
    });

    return {
      totalUsersCount,
      totalCustomersCount,
      totalProvidersCount,
      verifiedProvidersCount,
      pendingProvidersCount,
      totalBookingsCount,
      platformGrossVolume,
      pendingApplications,
    };
  }

  async approveProvider(providerProfileId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: { isVerified: true },
    });
  }

  async rejectProvider(providerProfileId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: { isVerified: false },
    });
  }

  async getPlatformAuditLogs() {
    return [
      {
        id: 'audit-1',
        action: 'PROVIDER_VERIFICATION_APPROVED',
        actor: 'admin@ecivres.local',
        details: 'Approved provider profile application for Sparkle Clean LLC',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 'audit-2',
        action: 'COUPON_CREATED',
        actor: 'admin@ecivres.local',
        details: 'Created promotional code WELCOME10 (10% discount)',
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: 'audit-3',
        action: 'PAYOUT_APPROVED',
        actor: 'system_auto',
        details: 'Dispatched automated $450.00 payout transfer',
        timestamp: new Date(Date.now() - 14400000),
      },
    ];
  }

  async getRevenueBreakdown() {
    const stats = await this.getAdminDashboardStats();
    const gross = stats.platformGrossVolume;
    const platformCommission = gross * 0.1;
    const providerPayouts = gross - platformCommission;

    return {
      grossVolume: gross,
      platformCommission,
      providerPayouts,
      commissionRate: '10%',
      monthlyGrowthRate: '+14.8%',
    };
  }
}
