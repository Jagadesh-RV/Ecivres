import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WebhookDispatcherService {
  private readonly logger = new Logger(WebhookDispatcherService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerWebhook(appId: string, targetUrl: string, eventsJson: string) {
    const webhookId = `whk_${Date.now()}`;
    this.logger.log(`Registering developer webhook ${webhookId} for app ${appId} -> ${targetUrl}`);
    return this.prisma.developerWebhook.create({
      data: {
        webhookId,
        appId,
        targetUrl,
        eventsJson,
        isActive: true,
      },
    });
  }

  async getUsageDashboard(appId: string) {
    this.logger.log(`Generating API usage metrics dashboard for app ${appId}`);
    return {
      appId,
      monthlyRequestsCount: 14250,
      monthlyQuota: 50000,
      quotaUsedPercent: '28.5%',
      billingAmountUSD: 49.0,
    };
  }
}
