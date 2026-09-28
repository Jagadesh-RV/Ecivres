import { Module } from '@nestjs/common';
import { GlobalPaymentRouterService } from './services/global-payment-router.service';
import { PaymentsGlobalController } from './payments-global.controller';

@Module({
  controllers: [PaymentsGlobalController],
  providers: [GlobalPaymentRouterService],
  exports: [GlobalPaymentRouterService],
})
export class PaymentsGlobalModule {}
