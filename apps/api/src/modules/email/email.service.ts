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

  async sendCancellationEmail(to: string, details: { bookingId: string; serviceName: string; reason?: string }) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Cancellation Notice #${details.bookingId}</h2>
        <p>Your booking for <strong>${details.serviceName}</strong> has been cancelled.</p>
        ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : ''}
      </div>
    `;
    return this.sendEmail({
      to,
      subject: `Booking Cancelled #${details.bookingId}`,
      html,
    });
  }

  async sendPaymentReceiptEmail(to: string, details: { paymentId: string; amount: number; serviceName: string; currency: string }) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Receipt #${details.paymentId}</h2>
        <p>Thank you for your payment for <strong>${details.serviceName}</strong>.</p>
        <p><strong>Amount Paid:</strong> ${details.currency} $${details.amount.toFixed(2)}</p>
      </div>
    `;
    return this.sendEmail({
      to,
      subject: `Payment Receipt #${details.paymentId}`,
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string, resetLink: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your EcivreS account.</p>
        <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Reset Your Password</a></p>
        <p>Or use reset token: <code>${resetToken}</code></p>
      </div>
    `;
    return this.sendEmail({
      to,
      subject: 'Reset Your EcivreS Password',
      html,
    });
  }
}
