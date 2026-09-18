import { Injectable, Logger } from '@nestjs/common';

export interface DirectBillingSettlement {
  settlementId: string;
  claimId: string;
  insurerCode: string;
  billedAmountUsd: number;
  approvedPayoutUsd: number;
  settlementStatus: 'PAID' | 'PENDING_REIMBURSEMENT';
  clearedAt: string;
}

@Injectable()
export class DirectBillingService {
  private readonly logger = new Logger(DirectBillingService.name);

  async processDirectBilling(claimId: string, insurerCode: string, amount: number): Promise<DirectBillingSettlement> {
    const settlementId = `stl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.logger.log(`Processing direct billing settlement ${settlementId} for claim ${claimId}`);

    return {
      settlementId,
      claimId,
      insurerCode,
      billedAmountUsd: amount,
      approvedPayoutUsd: amount,
      settlementStatus: 'PAID',
      clearedAt: new Date().toISOString(),
    };
  }
}
