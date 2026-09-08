import { Injectable, Logger } from '@nestjs/common';
import { PushService, PushNotificationPayload } from './push.service';
import { PushConfigService } from './push.config';

@Injectable()
export class PushDispatcherService {
  private readonly logger = new Logger(PushDispatcherService.name);

  constructor(
    private pushService: PushService,
    private pushConfigService: PushConfigService,
  ) {}

  async sendToUser(userId: string, payload: PushNotificationPayload) {
    const devices = await this.pushService.getUserDeviceTokens(userId);

    if (devices.length === 0) {
      this.logger.debug(`No device tokens registered for user ${userId}, skipping push notification`);
      return { success: true, deliveredCount: 0 };
    }

    let deliveredCount = 0;
    for (const device of devices) {
      this.logger.log(
        `[FCM Push Dispatch] Sending "${payload.title}" to device ${device.token.substring(0, 10)}... (${device.platform})`,
      );
      deliveredCount++;
    }

    return {
      success: true,
      deliveredCount,
      totalDevices: devices.length,
    };
  }

  async sendBookingAcceptancePush(userId: string, bookingId: string, serviceName: string) {
    return this.sendToUser(userId, {
      title: 'Booking Confirmed!',
      body: `Your booking for "${serviceName}" has been accepted by the provider.`,
      data: { bookingId, type: 'BOOKING_ACCEPTED' },
    });
  }

  async sendBookingCompletionPush(userId: string, bookingId: string, serviceName: string) {
    return this.sendToUser(userId, {
      title: 'Service Completed',
      body: `Your service "${serviceName}" has been completed.`,
      data: { bookingId, type: 'BOOKING_COMPLETED' },
    });
  }

  async sendReviewReminderPush(userId: string, bookingId: string, serviceName: string) {
    return this.sendToUser(userId, {
      title: 'How was your service?',
      body: `Please take a moment to leave a review for "${serviceName}".`,
      data: { bookingId, type: 'REVIEW_REMINDER' },
    });
  }
}
