import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RecurringScheduleConfig {
  customerId: string;
  serviceId: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: Date;
  repeatCount: number;
}

export interface ExpressCheckoutRequest {
  customerId: string;
  serviceId: string;
  preferredSlot: Date;
  savedPaymentMethodId: string;
}

@Injectable()
export class RecurringBookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecurringSchedule(config: RecurringScheduleConfig) {
    const dates: Date[] = [];
    const intervalDays = config.frequency === 'WEEKLY' ? 7 : config.frequency === 'BIWEEKLY' ? 14 : 30;

    for (let i = 0; i < config.repeatCount; i++) {
      const scheduledAt = new Date(config.startDate);
      scheduledAt.setDate(scheduledAt.getDate() + i * intervalDays);
      dates.push(scheduledAt);
    }

    return {
      recurringSubscriptionId: `sub_recur_${Date.now()}`,
      customerId: config.customerId,
      serviceId: config.serviceId,
      frequency: config.frequency,
      scheduledDates: dates,
      status: 'ACTIVE',
    };
  }

  async processExpressCheckout(request: ExpressCheckoutRequest) {
    return {
      bookingId: `express_bk_${Date.now()}`,
      customerId: request.customerId,
      serviceId: request.serviceId,
      status: 'CONFIRMED',
      scheduledAt: request.preferredSlot,
      paymentStatus: 'SUCCESS',
      isExpress: true,
    };
  }
}
