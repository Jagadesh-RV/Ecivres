import { Injectable, Logger } from '@nestjs/common';

export interface InstantPayoutResult {
  payoutId: string;
  providerId: string;
  amountRequested: number;
  feeDeducted: number;
  netPayoutAmount: number;
  destinationAccount: string;
  status: 'SETTLED_INSTANTLY';
}

@Injectable()
export class InstantPayoutService {
  private readonly logger = new Logger(InstantPayoutService.name);
  private readonly instantFeeRate = 0.015; // 1.5% instant payout fee

  async processInstantPayout(providerId: string, amount: number, destinationAccount: string): Promise<InstantPayoutResult> {
    const feeDeducted = Math.round(amount * this.instantFeeRate * 100) / 100;
    const netPayoutAmount = amount - feeDeducted;
    const payoutId = `payout_inst_${Date.now()}`;

    this.logger.log(`Processing instant payout for provider ${providerId}: \$${netPayoutAmount} net (Fee: \$${feeDeducted}) to ${destinationAccount}`);

    return {
      payoutId,
      providerId,
      amountRequested: amount,
      feeDeducted,
      netPayoutAmount,
      destinationAccount,
      status: 'SETTLED_INSTANTLY',
    };
  }
}
