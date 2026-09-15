import { Module } from '@nestjs/common';
import { EscrowWalletService } from './escrow-wallet.service';
import { InstantPayoutService } from './instant-payout.service';
import { TaxReportingService } from './tax-reporting.service';
import { FinanceController } from './finance.controller';

@Module({
  controllers: [FinanceController],
  providers: [EscrowWalletService, InstantPayoutService, TaxReportingService],
  exports: [EscrowWalletService, InstantPayoutService, TaxReportingService],
})
export class FinanceModule {}
