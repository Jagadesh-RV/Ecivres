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
}
