import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { UpdateBookingStatusDto, BookingStatus } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!customer) {
      throw new BadRequestException('User does not have a customer profile');
    }

    const service = await this.prisma.service.findUnique({
      where: { id: createBookingDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.booking.create({
      data: {
        customerId: customer.user.id, // Booking expects user ID based on schema `customer User @relation(...)` wait, schema says `customerId String`, `customer User`. So customerId is User ID.
        serviceId: service.id,
        scheduledAt: new Date(createBookingDto.scheduledAt),
      },
      include: {
        service: {
          include: {
            provider: true,
          },
        },
      },
    });
  }

  async findAllForCustomer(userId: string) {
    return this.prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        review: true,
        service: {
          include: {
            provider: true,
            category: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
  async findAllForProvider(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new BadRequestException('User does not have a provider profile');
    }

    return this.prisma.booking.findMany({
      where: {
        service: {
          providerId: provider.id,
        },
      },
      include: {
        customer: {
          include: {
            customerProfile: true,
          }
        },
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async updateStatus(bookingId: string, userId: string, updateDto: UpdateBookingStatusDto) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new BadRequestException('User does not have a provider profile');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.service.providerId !== provider.id) {
      throw new BadRequestException('You do not have permission to update this booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: updateDto.status },
      include: {
        customer: {
          include: {
            customerProfile: true,
          }
        },
        service: true,
      },
    });
  }
}
