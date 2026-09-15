import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EscrowWalletService } from './escrow-wallet.service';
import { InstantPayoutService } from './instant-payout.service';
import { TaxReportingService } from './tax-reporting.service';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly escrowWallet: EscrowWalletService,
    private readonly instantPayout: InstantPayoutService,
    private readonly taxReporting: TaxReportingService,
  ) {}

  @Post('escrow/hold')
  holdEscrow(@Body() body: { bookingId: string; amount: number; currency?: string }) {
    return this.escrowWallet.holdFunds(body.bookingId, body.amount, body.currency);
  }

  @Post('escrow/release')
  releaseEscrow(@Body() body: { escrowHoldId: string }) {
    return this.escrowWallet.releaseFunds(body.escrowHoldId);
  }

  @Post('instant-payout')
  requestInstantPayout(@Body() body: { providerId: string; amount: number; destinationAccount: string }) {
    return this.instantPayout.processInstantPayout(body.providerId, body.amount, body.destinationAccount);
  }

  @Get('tax-report/1099k')
  getTaxReport(@Query('providerId') providerId: string, @Query('year') year: number) {
    return this.taxReporting.generate1099KReport(providerId || 'prov_demo', Number(year) || 2026);
  }
}
