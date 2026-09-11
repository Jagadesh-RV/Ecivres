import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCustomerProfileDto,
  UpdateCustomerProfileDto,
} from './dto/customer-profile.dto';
import { generateSmartGreeting } from './utils/customer-greeting.util';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Customer profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, createDto: CreateCustomerProfileDto) {
    const existing = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Customer profile already exists');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: 'CUSTOMER' },
    });
    if (role) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }

    return this.prisma.customerProfile.create({
      data: {
        userId,
        ...createDto,
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateCustomerProfileDto) {
    const existing = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Customer profile not found');
    }

    return this.prisma.customerProfile.update({
      where: { userId },
      data: updateDto,
    });
  }

  async getDashboard2(userId: string) {
    const profile = await this.getProfile(userId).catch(() => null);
    const firstName = profile?.firstName || 'Customer';

    const greeting = generateSmartGreeting(firstName);

    const recentBookings = await this.prisma.booking.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        service: {
          select: { id: true, name: true, price: true, provider: { select: { businessName: true } } },
        },
      },
    });

    const activeBooking = recentBookings.find((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');

    return {
      greeting,
      recentBookings,
      continueBooking: activeBooking || null,
      aiQuickActions: [
        { label: 'Emergency AC Repair', action: 'SMART_SEARCH', query: 'Emergency AC repair near me' },
        { label: 'Book Instant Plumbing', action: 'SMART_SEARCH', query: 'Plumbing repair today' },
        { label: 'Rebook Last Service', action: 'REBOOK', bookingId: recentBookings[0]?.id },
      ],
      trendingServices: [
        { id: 'tr_1', title: 'Deep Home Cleaning', discount: '20% OFF', category: 'Cleaning' },
        { id: 'tr_2', title: 'Full AC Maintenance', discount: 'Popular', category: 'HVAC' },
      ],
    };
  }
}
