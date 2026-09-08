import { Injectable, Logger } from '@nestjs/common';
import { EmailConfigService } from './email.config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private emailConfigService: EmailConfigService) {}

  async sendEmail(options: EmailOptions) {
    const from = this.emailConfigService.getFromEmail();
    const apiKey = this.emailConfigService.getApiKey();

    this.logger.log(`[Resend Email] Sending "${options.subject}" to ${options.to} via ${from}`);
    return {
      id: `resend-${Date.now()}`,
      to: options.to,
      subject: options.subject,
      status: 'SENT',
    };
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to EcivreS Marketplace, ${name}!</h2>
        <p>We are excited to have you join our marketplace platform.</p>
        <p>Explore thousands of verified local services or set up your provider business today.</p>
      </div>
    `;
    return this.sendEmail({
      to,
      subject: 'Welcome to EcivreS Marketplace',
      html,
    });
  }

  async sendBookingConfirmationEmail(to: string, details: { bookingId: string; serviceName: string; scheduledAt: string; price: number }) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Confirmation #${details.bookingId}</h2>
        <p>Your booking for <strong>${details.serviceName}</strong> has been confirmed.</p>
        <p><strong>Scheduled Time:</strong> ${new Date(details.scheduledAt).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> $${details.price.toFixed(2)}</p>
      </div>
    `;
    return this.sendEmail({
      to,
      subject: `Booking Confirmed #${details.bookingId}`,
      html,
    });
  }
}
