import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface FollowUpSchedule {
  bookingId: string;
  customerId: string;
  scheduledAt: Date;
  channel: 'SMS' | 'EMAIL' | 'PUSH';
  status: 'PENDING' | 'SENT';
}

@Injectable()
export class AutoFollowUpService {
  private readonly logger = new Logger(AutoFollowUpService.name);
  private followUps: Map<string, FollowUpSchedule> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async schedulePostServiceFollowUp(
    bookingId: string,
    customerId: string,
    delayHours: number = 2,
  ): Promise<FollowUpSchedule> {
    const scheduledAt = new Date(Date.now() + 1000 * 60 * 60 * delayHours);

    const schedule: FollowUpSchedule = {
      bookingId,
      customerId,
      scheduledAt,
      channel: 'PUSH',
      status: 'PENDING',
    };

    this.followUps.set(bookingId, schedule);
    return schedule;
  }

  async triggerFollowUp(bookingId: string): Promise<{ sent: boolean; message: string }> {
    const item = this.followUps.get(bookingId);
    if (!item) return { sent: false, message: 'No pending follow-up found' };

    item.status = 'SENT';
    return {
      sent: true,
      message: 'How was your service today? Tap to rate your provider and leave a photo review.',
    };
  }
}
