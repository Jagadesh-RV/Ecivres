import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EscrowWalletService } from './escrow-wallet.service';
import { InstantPayoutService } from './instant-payout.service';
import { TaxReportingService } from './tax-reporting.service';
import { MicroLoanService } from './micro-loan.service';
import { ApplyMicroLoanDto } from './dto/micro-loan.dto';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly escrowWallet: EscrowWalletService,
    private readonly instantPayout: InstantPayoutService,
    private readonly taxReporting: TaxReportingService,
    private readonly microLoanService: MicroLoanService,
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

  @Post('micro-loan/apply')
  applyMicroLoan(@Body() dto: ApplyMicroLoanDto) {
    return this.microLoanService.evaluateAndIssueLoan(dto);
  }
}
