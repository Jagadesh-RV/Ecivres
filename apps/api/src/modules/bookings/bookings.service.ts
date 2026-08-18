import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';

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
          }
        }
      }
    });
  }

  async findAllForCustomer(userId: string) {
    return this.prisma.booking.findMany({
      where: { customerId: userId },
      include: {
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
}
