import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StripeConnectService {
  private readonly logger = new Logger(StripeConnectService.name);

  constructor(private readonly prisma: PrismaService) {}

  getStripeClient() {
    return {
      apiKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_123',
      apiVersion: '2023-10-16',
    };
  }

  async createExpressAccount(providerId: string) {
    const stripeAccountId = `acct_express_${Date.now()}`;
    this.logger.log(`Creating Stripe Connect Express account ${stripeAccountId} for provider ${providerId}`);
    return this.prisma.stripeConnectAccount.create({
      data: {
        providerId,
        stripeAccountId,
        payoutsEnabled: false,
        detailsSubmitted: false,
      },
    });
  }

  async generateOnboardingLink(providerId: string) {
    let account = await this.prisma.stripeConnectAccount.findUnique({ where: { providerId } });
    if (!account) {
      account = await this.createExpressAccount(providerId);
    }
    const onboardingUrl = `https://connect.stripe.com/express/onboarding/${account.stripeAccountId}`;
    await this.prisma.stripeConnectAccount.update({
      where: { providerId },
      data: { onboardingUrl },
    });
    this.logger.log(`Generated Stripe Connect onboarding link for ${providerId}: ${onboardingUrl}`);
    return { providerId, stripeAccountId: account.stripeAccountId, onboardingUrl };
  }

  async getAccountStatus(providerId: string) {
    const account = await this.prisma.stripeConnectAccount.findUnique({ where: { providerId } });
    if (!account) {
      return { providerId, registered: false, payoutsEnabled: false };
    }
    return {
      providerId,
      registered: true,
      stripeAccountId: account.stripeAccountId,
      payoutsEnabled: account.payoutsEnabled,
      detailsSubmitted: account.detailsSubmitted,
    };
  }
}
