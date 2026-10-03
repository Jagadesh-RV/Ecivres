import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomerRetentionService {
  private readonly logger = new Logger(CustomerRetentionService.name);

  generateRetentionOffer(userId: string, segment: string, marketingOptIn: boolean) {
    this.logger.log(`Generating retention offer for user ${userId} in segment ${segment}`);
    if (!marketingOptIn) {
      return { userId, eligible: false, reason: 'User opted out of marketing communications' };
    }

    let promoCode: string | null = null;
    let message = '';

    if (segment === 'AT_RISK') {
      promoCode = 'COMEBACK15';
      message = 'We miss you! Take 15% off your next service booking.';
    } else if (segment === 'HIGH_VALUE') {
      promoCode = 'VIP20';
      message = 'Thank you for being a valued customer! Enjoy 20% off your next booking.';
    } else if (segment === 'DORMANT') {
      promoCode = 'REACTIVATE25';
      message = 'Special welcome back offer: 25% off!';
    } else {
      message = 'Explore our top-rated local providers today.';
    }

    return {
      userId,
      segment,
      eligible: true,
      promoCode,
      message,
    };
  }
}
