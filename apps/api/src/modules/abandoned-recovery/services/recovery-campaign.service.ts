import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AbandonedBookingService } from './abandoned-booking.service';

@Injectable()
export class RecoveryCampaignService {
  private readonly logger = new Logger(RecoveryCampaignService.name);
  private readonly lastSentMap = new Map<string, Date>(); // userId -> last sent time

  constructor(private readonly abandonedService: AbandonedBookingService) {}

  async triggerRecoveryCampaign(userId: string, marketingOptIn: boolean) {
    if (!marketingOptIn) {
      throw new BadRequestException(`User ${userId} has opted out of recovery communications`);
    }

    const lastSent = this.lastSentMap.get(userId);
    const now = new Date();
    if (lastSent && now.getTime() - lastSent.getTime() < 24 * 60 * 60 * 1000) {
      return { userId, triggered: false, reason: 'Frequency cap reached (Max 1 recovery per 24 hours)' };
    }

    const unrecovered = await this.abandonedService.getUnrecoveredEvents(userId);
    if (unrecovered.length === 0) {
      return { userId, triggered: false, reason: 'No unrecovered abandoned events found' };
    }

    this.lastSentMap.set(userId, now);
    const targetEvent = unrecovered[unrecovered.length - 1];

    this.logger.log(`Dispatched recovery campaign for user ${userId} targeting event ${targetEvent.eventType}`);
    return {
      userId,
      triggered: true,
      targetEventType: targetEvent.eventType,
      promoDiscount: targetEvent.eventType === 'PAYMENT' ? '10% OFF' : '5% OFF',
      channel: 'PUSH_NOTIFICATION',
    };
  }
}
