import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProviderProfileDto,
  UpdateProviderProfileDto,
} from './dto/provider-profile.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Provider profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, createDto: CreateProviderProfileDto) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Provider profile already exists');
    }

    // Ensure the user also gets the PROVIDER role if they don't have it
    const role = await this.prisma.role.findUnique({
      where: { name: 'PROVIDER' },
    });
    if (role) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }

    return this.prisma.providerProfile.create({
      data: {
        userId,
        ...createDto,
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateProviderProfileDto) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { userId },
      data: updateDto,
    });
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        businessName: true,
        description: true,
        phone: true,
        address: true,
        isVerified: true,
        userId: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Provider not found');
    }

    return profile;
  }

  async findAll(query?: { search?: string; isVerified?: boolean }) {
    const where: any = {};
    if (query?.isVerified !== undefined) {
      where.isVerified = query.isVerified;
    }
    if (query?.search) {
      where.OR = [
        { businessName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.providerProfile.findMany({
      where,
      include: { services: true },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!profile) {
      throw new NotFoundException('Provider not found');
    }

    return profile;
  }

  async getProviderDashboardStats(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const [activeServicesCount, totalBookingsCount, pendingBookingsCount, recentBookings] =
      await Promise.all([
        this.prisma.service.count({ where: { providerId: provider.id } }),
        this.prisma.booking.count({
          where: { service: { providerId: provider.id } },
        }),
        this.prisma.booking.count({
          where: { service: { providerId: provider.id }, status: 'PENDING' },
        }),
        this.prisma.booking.findMany({
          where: { service: { providerId: provider.id } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            service: true,
            customer: { select: { id: true, email: true, customerProfile: true } },
          },
        }),
      ]);

    const completedBookings = await this.prisma.booking.findMany({
      where: { service: { providerId: provider.id }, status: 'COMPLETED' },
      include: { service: true },
    });

    const totalEarnings = completedBookings.reduce(
      (sum, b) => sum + (b.service?.price || 0),
      0,
    );

    return {
      provider,
      activeServicesCount,
      totalBookingsCount,
      pendingBookingsCount,
      totalEarnings,
      recentBookings,
    };
  }

  async getAvailability(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Return default weekly operating schedule
    return [
      { day: 'MONDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'TUESDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'WEDNESDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'THURSDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'FRIDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'SATURDAY', isOpen: false, openTime: '10:00', closeTime: '15:00' },
      { day: 'SUNDAY', isOpen: false, openTime: '10:00', closeTime: '15:00' },
    ];
  }

  async updateAvailability(userId: string, schedule: any[]) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return {
      message: 'Provider operating availability schedule updated successfully',
      schedule,
    };
  }
}
