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

  async checkReviewEligibility(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        review: true,
        service: true,
      },
    });

    if (!booking) {
      return { eligible: false, reason: 'Booking not found' };
    }

    if (booking.customerId !== userId) {
      return { eligible: false, reason: 'Booking does not belong to user' };
    }

    if (booking.status !== 'COMPLETED') {
      return { eligible: false, reason: 'Booking service is not completed yet' };
    }

    if (booking.review) {
      return { eligible: false, reason: 'Review has already been submitted for this booking' };
    }

    return { eligible: true, booking };
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

  private flaggedReviews: Record<string, { reason: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; note?: string }> = {
    'rev-sample-1': { reason: 'Inappropriate language in feedback', status: 'PENDING' },
  };

  async flagReview(reviewId: string, reason: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review with ID '${reviewId}' not found`);
    }

    this.flaggedReviews[reviewId] = {
      reason,
      status: 'PENDING',
    };

    return { message: 'Review successfully flagged for admin moderation', reviewId };
  }

  async getFlaggedReviews() {
    const flaggedIds = Object.keys(this.flaggedReviews).filter(
      (id) => this.flaggedReviews[id].status === 'PENDING',
    );

    const reviews = await this.prisma.review.findMany({
      where: { id: { in: flaggedIds } },
      include: {
        author: { select: { email: true } },
        booking: { include: { service: true } },
      },
    });

    return reviews.map((r) => ({
      ...r,
      flagInfo: this.flaggedReviews[r.id],
    }));
  }

  async moderateReview(reviewId: string, action: 'APPROVE' | 'REJECT', note?: string) {
    const flagRecord = this.flaggedReviews[reviewId];
    if (!flagRecord) {
      throw new NotFoundException(`No pending moderation record for review '${reviewId}'`);
    }

    flagRecord.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    flagRecord.note = note;

    if (action === 'REJECT') {
      // Remove or hide review if rejected
      await this.prisma.review.delete({ where: { id: reviewId } }).catch(() => null);
    }

    return {
      reviewId,
      action,
      status: flagRecord.status,
      note,
    };
  }
}
