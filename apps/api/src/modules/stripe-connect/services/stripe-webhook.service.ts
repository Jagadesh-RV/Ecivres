import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handlePayoutWebhook(event: { type: string; data: { object: { id: string; account: string; amount: number; status: string } } }) {
    this.logger.log(`Processing Stripe Payout Webhook event: ${event.type}`);
    if (event.type === 'payout.paid' || event.type === 'account.updated') {
      const accountId = event.data.object.account;
      if (accountId) {
        await this.prisma.stripeConnectAccount.updateMany({
          where: { stripeAccountId: accountId },
          data: { payoutsEnabled: true, detailsSubmitted: true },
        });
      }
    }
    return { received: true, eventType: event.type };
  }
}
