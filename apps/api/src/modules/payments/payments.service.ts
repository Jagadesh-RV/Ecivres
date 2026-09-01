import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private stripeService: StripeService,
  ) {}

  async createPaymentIntent(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    let payment = booking.payment;
    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.service.price,
          status: 'PENDING',
        },
      });
    }

    if (payment.status === 'SUCCESS') {
      throw new BadRequestException('Booking is already paid');
    }

    const stripeIntent = await this.stripeService.createPaymentIntent(
      payment.amount,
      'usd',
      { bookingId: booking.id, paymentId: payment.id }
    );

    // Save intent ID as transaction ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: stripeIntent.id,
      },
    });

    return {
      clientSecret: stripeIntent.client_secret,
      amount: payment.amount,
      paymentId: payment.id,
      transactionId: stripeIntent.id,
    };
  }

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
      include: { booking: { include: { service: { include: { provider: true } } } } },
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

    // Notify provider of successful payment
    try {
      const providerUserId = payment.booking.service.provider.userId;
      await this.notificationsService.create(
        providerUserId,
        'Payment Received',
        `Payment of $${payment.amount} has been received for "${payment.booking.service.name}".`,
      );
    } catch (err) {
      console.error('Failed to send payment notification', err);
    }

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
