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
}
