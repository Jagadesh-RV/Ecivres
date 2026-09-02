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
}
