import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { UpdateBookingStatusDto, BookingStatus } from './dto/update-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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
      include: { provider: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const scheduledDate = new Date(createBookingDto.scheduledAt);
    const existingConflict = await this.prisma.booking.findFirst({
      where: {
        serviceId: service.id,
        scheduledAt: scheduledDate,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });

    if (existingConflict) {
      throw new BadRequestException('The selected time slot is already booked for this service');
    }

    const newBooking = await this.prisma.booking.create({
      data: {
        customerId: customer.user.id, // Booking expects user ID based on schema `customer User @relation(...)` wait, schema says `customerId String`, `customer User`. So customerId is User ID.
        serviceId: service.id,
        scheduledAt: new Date(createBookingDto.scheduledAt),
        payment: {
          create: {
            amount: service.price,
            status: 'PENDING',
          },
        },
      },
      include: {
        payment: true,
        service: {
          include: {
            provider: true,
          },
        },
      },
    });

    // Notify provider of a new booking request
    try {
      const providerUserId = service.provider.userId;
      const clientName = customer.firstName ? `${customer.firstName} ${customer.lastName || ''}` : 'A customer';
      const dateStr = newBooking.scheduledAt ? new Date(newBooking.scheduledAt).toLocaleString() : '';
      await this.notificationsService.create(
        providerUserId,
        'New Booking Request',
        `${clientName} has booked your service "${service.name}"${dateStr ? ' for ' + dateStr : ''}`,
      );
    } catch (err) {
      console.error('Failed to send booking notification', err);
    }

    return newBooking;
  }

  async findAllForCustomer(userId: string) {
    return this.prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        review: true,
        payment: true,
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
        payment: true,
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

    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    const currentStatus = booking.status as string;
    const targetStatus = updateDto.status as string;

    if (currentStatus !== targetStatus) {
      const allowed = validTransitions[currentStatus] || [];
      if (!allowed.includes(targetStatus)) {
        throw new BadRequestException(`Invalid booking status transition from ${currentStatus} to ${targetStatus}`);
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: updateDto.status },
      include: {
        payment: true,
        customer: {
          include: {
            customerProfile: true,
          }
        },
        service: true,
      },
    });

    // Notify customer of status change
    try {
      await this.notificationsService.create(
        updatedBooking.customerId,
        'Booking Status Updated',
        `Your booking for "${updatedBooking.service.name}" has been updated to ${updatedBooking.status}`,
      );
    } catch (err) {
      console.error('Failed to send status update notification', err);
    }

    return updatedBooking;
  }

  async acceptBooking(bookingId: string, userId: string) {
    return this.updateStatus(bookingId, userId, { status: 'CONFIRMED' as any });
  }

  async rejectBooking(bookingId: string, userId: string, reason?: string) {
    const updated = await this.updateStatus(bookingId, userId, { status: 'CANCELLED' as any });
    if (reason) {
      try {
        await this.notificationsService.create(
          updated.customerId,
          'Booking Declined',
          `Your booking for "${updated.service.name}" was declined by provider: ${reason}`,
        );
      } catch (err) {
        console.error('Failed to send rejection notification', err);
      }
    }
    return updated;
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot cancel a booking that is already ${booking.status.toLowerCase()}`);
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: { service: { include: { provider: true } } },
    });

    try {
      await this.notificationsService.create(
        updated.service.provider.userId,
        'Booking Cancelled',
        `A booking for "${updated.service.name}" was cancelled${reason ? ': ' + reason : '.'}`,
      );
    } catch (err) {
      console.error('Failed to send cancellation notification', err);
    }

    return updated;
  }

  async rescheduleBooking(bookingId: string, userId: string, newScheduledAt: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: { include: { provider: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId && booking.service.provider.userId !== userId) {
      throw new ForbiddenException('You do not have permission to reschedule this booking');
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot reschedule a booking that is already ${booking.status.toLowerCase()}`);
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        scheduledAt: new Date(newScheduledAt),
        status: 'CONFIRMED',
      },
      include: {
        service: { include: { provider: true } },
        payment: true,
      },
    });

    try {
      const recipientId = booking.customerId === userId ? updated.service.provider.userId : updated.customerId;
      await this.notificationsService.create(
        recipientId,
        'Booking Rescheduled',
        `Booking for "${updated.service.name}" was rescheduled to ${new Date(newScheduledAt).toLocaleString()}`,
      );
    } catch (err) {
      console.error('Failed to send reschedule notification', err);
    }

    return updated;
  }
}
