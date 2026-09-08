import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue.service';

export interface BookingReminderJobData {
  bookingId: string;
  customerId: string;
  providerUserId: string;
  scheduledAt: string;
  reminderType: '24H_BEFORE' | '1H_BEFORE';
}

@Injectable()
export class BookingReminderJobProcessor {
  private readonly logger = new Logger(BookingReminderJobProcessor.name);

  constructor(private queueService: QueueService) {}

  async scheduleReminder(data: BookingReminderJobData) {
    this.logger.log(`Scheduling ${data.reminderType} reminder job for booking ${data.bookingId}`);
    return this.queueService.addJob('BOOKING_REMINDER', data);
  }
}
