import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppMessagingService {
  private readonly logger = new Logger(WhatsAppMessagingService.name);

  async sendBookingConfirmation(toPhoneNumber: string, bookingId: string, serviceName: string, date: string) {
    const templateName = 'ecivres_booking_confirmation';
    this.logger.log(`Sending WhatsApp template '${templateName}' to ${toPhoneNumber} for booking ${bookingId}`);
    return {
      messageId: `wamid_${Date.now()}`,
      to: toPhoneNumber,
      template: templateName,
      status: 'DELIVERED',
      parameters: { bookingId, serviceName, date },
    };
  }
}
