import { Module } from '@nestjs/common';
import { EscrowWalletService } from './escrow-wallet.service';
import { InstantPayoutService } from './instant-payout.service';
import { TaxReportingService } from './tax-reporting.service';
import { MicroLoanService } from './micro-loan.service';
import { FinanceController } from './finance.controller';

@Module({
  controllers: [FinanceController],
  providers: [EscrowWalletService, InstantPayoutService, TaxReportingService, MicroLoanService],
  exports: [EscrowWalletService, InstantPayoutService, TaxReportingService, MicroLoanService],
})
export class FinanceModule {}
