import { Injectable, Logger } from '@nestjs/common';

export type CustomerLifecycleSegment = 'NEW' | 'ACTIVATED' | 'ACTIVE' | 'REPEAT_CUSTOMER' | 'HIGH_VALUE' | 'AT_RISK' | 'DORMANT';

@Injectable()
export class CustomerLifecycleService {
  private readonly logger = new Logger(CustomerLifecycleService.name);

  determineSegment(bookingCount: number, totalSpendUsd: number, daysSinceLastBooking: number): CustomerLifecycleSegment {
    this.logger.log(`Evaluating lifecycle segment for customer (Bookings: ${bookingCount}, Spend: $${totalSpendUsd}, Days Since Last: ${daysSinceLastBooking})`);

    if (totalSpendUsd >= 1000 || bookingCount >= 10) return 'HIGH_VALUE';
    if (daysSinceLastBooking > 90) return 'DORMANT';
    if (daysSinceLastBooking > 45) return 'AT_RISK';
    if (bookingCount >= 3) return 'REPEAT_CUSTOMER';
    if (bookingCount >= 1) return 'ACTIVE';
    if (daysSinceLastBooking <= 7) return 'ACTIVATED';
    return 'NEW';
  }
}
