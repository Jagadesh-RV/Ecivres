import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateReviewDto) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new BadRequestException('User does not have a customer profile');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: createDto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new BadRequestException('You did not make this booking');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed services');
    }

    // Check if review already exists
    const existing = await this.prisma.review.findFirst({
      where: { bookingId: createDto.bookingId },
    });

    if (existing) {
      throw new BadRequestException('You already reviewed this booking');
    }

    return this.prisma.review.create({
      data: {
        rating: createDto.rating,
        comment: createDto.comment,
        authorId: userId,
        bookingId: createDto.bookingId,
      },
      include: {
        author: true,
      }
    });
  }

  async findByService(serviceId: string) {
    return this.prisma.review.findMany({
      where: { booking: { serviceId } },
      include: {
        author: {
          include: { customerProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.review.findMany({
      where: { booking: { service: { providerId } } },
      include: {
        author: {
          select: { email: true },
        },
        booking: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProviderStats(providerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { booking: { service: { providerId } } },
      select: { rating: true },
    });

    if (reviews.length === 0) return { average: 0, count: 0 };

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  }
}
