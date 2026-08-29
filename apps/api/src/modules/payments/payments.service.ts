import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.payment) {
      return booking.payment;
    }

    return this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.service.price,
        status: 'PENDING',
      },
    });
  }

  async processPayment(bookingId: string, transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === 'SUCCESS') {
      return payment;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { bookingId },
      data: {
        status: 'SUCCESS',
        transactionId,
      },
    });

    // Optionally update booking status if needed
    // In our case we keep the booking status as CONFIRMED or update it. 
    // Let's leave booking status as is, or set it to CONFIRMED if it was PENDING.
    if (payment.booking.status === 'PENDING') {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    return updatedPayment;
  }

  async getPaymentByBooking(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this booking');
    }

    return payment;
  }
}
