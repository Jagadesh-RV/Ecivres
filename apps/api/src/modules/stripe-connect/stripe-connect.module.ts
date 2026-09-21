import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StripeConnectService } from './services/stripe-connect.service';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeConnectController } from './stripe-connect.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StripeConnectController],
  providers: [StripeConnectService, StripeWebhookService],
  exports: [StripeConnectService, StripeWebhookService],
})
export class StripeConnectModule {}
