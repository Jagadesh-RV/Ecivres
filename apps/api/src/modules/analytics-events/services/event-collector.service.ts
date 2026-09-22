import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EventCollectorService {
  private readonly logger = new Logger(EventCollectorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackBookingEvent(userId: string, bookingId: string, eventType: string, payload: any) {
    const eventId = `evt_bk_${Date.now()}`;
    this.logger.log(`Ingesting booking event stream ${eventId} (${eventType}) for booking ${bookingId}`);
    return this.prisma.marketplaceAnalyticsEvent.create({
      data: {
        eventId,
        eventType: `BOOKING_${eventType.toUpperCase()}`,
        userId,
        payloadJson: JSON.stringify({ bookingId, ...payload }),
      },
    });
  }

  async trackPaymentEvent(userId: string, paymentIntentId: string, amountUSD: number, status: string) {
    const eventId = `evt_pmt_${Date.now()}`;
    this.logger.log(`Ingesting payment event stream ${eventId} ($${amountUSD} - ${status})`);
    return this.prisma.marketplaceAnalyticsEvent.create({
      data: {
        eventId,
        eventType: `PAYMENT_${status.toUpperCase()}`,
        userId,
        payloadJson: JSON.stringify({ paymentIntentId, amountUSD, status }),
      },
    });
  }
}
