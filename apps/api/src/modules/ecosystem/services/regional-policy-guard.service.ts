import { Injectable, Logger } from '@nestjs/common';
import { RegionalMarketService } from './regional-market.service';
import { CurrencyMathService, MoneyValue } from './currency-math.service';

export interface CancellationEvaluationResult {
  isEligibleForRefund: boolean;
  refundPercentage: number;
  refundAmountMinorUnits: number;
  feeMinorUnits: number;
  reason: string;
  regionalRuleApplied: string;
}

@Injectable()
export class RegionalPolicyGuardService {
  private readonly logger = new Logger(RegionalPolicyGuardService.name);

  constructor(
    private readonly regionalMarketService: RegionalMarketService,
    private readonly mathService: CurrencyMathService,
  ) {}

  /**
   * Evaluates refund eligibility and fee for booking cancellations based on regional policy laws.
   */
  async evaluateCancellation(
    regionCode: string,
    bookingTotalMinorUnits: number,
    currency: string,
    hoursUntilService: number,
  ): Promise<CancellationEvaluationResult> {
    const region = await this.regionalMarketService.getRegion(regionCode);
    const total: MoneyValue = { minorUnits: bookingTotalMinorUnits, currency: currency.toUpperCase() };

    let refundPercentage = 0;
    let rule = '';

    // European Union & Germany: Strict consumer protection laws
    if (region.code === 'DE' || region.code === 'GB') {
      if (hoursUntilService >= region.cancellationWindowHours) {
        refundPercentage = 100;
        rule = `Full statutory refund granted (${hoursUntilService}h >= ${region.cancellationWindowHours}h window)`;
      } else if (hoursUntilService >= 12) {
        refundPercentage = 50;
        rule = `Partial refund of 50% under late cancellation policy`;
      } else {
        refundPercentage = 0;
        rule = `No refund for short notice cancellation (<12h before appointment)`;
      }
    } else {
      // General marketplace rule: US, IN, AE, SG, JP
      if (hoursUntilService >= region.cancellationWindowHours) {
        refundPercentage = 100;
        rule = `Full refund under standard ${region.cancellationWindowHours}h policy`;
      } else if (hoursUntilService >= 6) {
        refundPercentage = 75;
        rule = `75% refund with late fee deduction`;
      } else {
        refundPercentage = 0;
        rule = `Non-refundable for immediate same-day cancellation`;
      }
    }

    const basisPoints = refundPercentage * 100;
    const refundMoney = this.mathService.multiplyBasisPoints(total, basisPoints);
    const feeMoney = this.mathService.subtract(total, refundMoney);

    this.logger.log(
      `Cancellation evaluated for region ${region.code}: ${refundPercentage}% refund (${refundMoney.minorUnits} ${currency}). Rule: ${rule}`,
    );

    return {
      isEligibleForRefund: refundPercentage > 0,
      refundPercentage,
      refundAmountMinorUnits: refundMoney.minorUnits,
      feeMinorUnits: feeMoney.minorUnits,
      reason: rule,
      regionalRuleApplied: `${region.code}_CANCELLATION_STATUTE`,
    };
  }
}
