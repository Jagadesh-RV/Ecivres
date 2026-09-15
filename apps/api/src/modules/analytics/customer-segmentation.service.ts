import { Injectable, Logger } from '@nestjs/common';

export interface CustomerSegment {
  customerId: string;
  segmentTier: 'HIGH_VALUE_VIP' | 'REGULAR_LOYAL' | 'AT_RISK' | 'CHURNED';
  predictedLtv: number;
  recommendedEngagementStrategy: string;
}

@Injectable()
export class CustomerSegmentationService {
  private readonly logger = new Logger(CustomerSegmentationService.name);

  segmentCustomer(customerId: string, totalSpend: number, totalBookings: number): CustomerSegment {
    this.logger.log(`Segmenting customer ${customerId} (Spend: \$${totalSpend}, Bookings: ${totalBookings})`);

    if (totalSpend >= 1000 || totalBookings >= 10) {
      return {
        customerId,
        segmentTier: 'HIGH_VALUE_VIP',
        predictedLtv: 3500,
        recommendedEngagementStrategy: 'Assign dedicated VIP account concierge and 10% cash-back reward',
      };
    }

    return {
      customerId,
      segmentTier: 'REGULAR_LOYAL',
      predictedLtv: 1200,
      recommendedEngagementStrategy: 'Send monthly seasonal home maintenance reminders',
    };
  }
}
