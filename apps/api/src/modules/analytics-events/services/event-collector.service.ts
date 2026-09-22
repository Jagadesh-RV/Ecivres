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

  async trackSearchEvent(userId: string, searchQuery: string, categoryId?: string) {
    const eventId = `evt_srch_${Date.now()}`;
    this.logger.log(`Ingesting search event stream ${eventId} ("${searchQuery}")`);
    return this.prisma.marketplaceAnalyticsEvent.create({
      data: {
        eventId,
        eventType: 'SEARCH_QUERY',
        userId,
        payloadJson: JSON.stringify({ searchQuery, categoryId }),
      },
    });
  }

  async trackReferralEvent(referrerUserId: string, referredUserId: string, referralCode: string) {
    const eventId = `evt_ref_${Date.now()}`;
    this.logger.log(`Ingesting referral event stream ${eventId} (Code: ${referralCode})`);
    return this.prisma.marketplaceAnalyticsEvent.create({
      data: {
        eventId,
        eventType: 'USER_REFERRAL_CONVERTED',
        userId: referrerUserId,
        payloadJson: JSON.stringify({ referredUserId, referralCode }),
      },
    });
  }
}
