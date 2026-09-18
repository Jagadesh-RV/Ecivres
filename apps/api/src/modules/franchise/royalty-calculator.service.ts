import { Injectable } from '@nestjs/common';

export interface RoyaltySplitResult {
  franchiseId: string;
  grossRevenueUsd: number;
  royaltyPercentage: number;
  royaltyFeeUsd: number;
  netBranchRevenueUsd: number;
}

@Injectable()
export class RoyaltyCalculatorService {
  calculateRoyaltySplit(franchiseId: string, grossRevenueUsd: number, royaltyPercentage: number): RoyaltySplitResult {
    const royaltyFeeUsd = Math.round((grossRevenueUsd * (royaltyPercentage / 100)) * 100) / 100;
    const netBranchRevenueUsd = Math.round((grossRevenueUsd - royaltyFeeUsd) * 100) / 100;

    return {
      franchiseId,
      grossRevenueUsd,
      royaltyPercentage,
      royaltyFeeUsd,
      netBranchRevenueUsd,
    };
  }
}
