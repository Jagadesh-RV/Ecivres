import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_mock_key';
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: any) {
    const key = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!key || key === 'sk_test_mock_key') {
      return {
        id: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
        client_secret: 'pi_mock_secret_' + Math.random().toString(36).substr(2, 9),
        amount,
        currency,
      };
    }

    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,
      metadata,
    });
  }
}
