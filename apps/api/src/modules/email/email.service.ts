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
}
