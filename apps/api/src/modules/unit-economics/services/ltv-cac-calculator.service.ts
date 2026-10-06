import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LtvCacCalculatorService {
  private readonly logger = new Logger(LtvCacCalculatorService.name);

  calculateLtvCacMetrics(cacUsd: number, arpuMonthlyUsd: number, grossMarginPct: number, churnRateMonthlyPct: number) {
    this.logger.log(`Calculating LTV / CAC metrics (CAC: $${cacUsd}, ARPU: $${arpuMonthlyUsd})`);

    const lifetimeMonths = churnRateMonthlyPct > 0 ? 100 / churnRateMonthlyPct : 36;
    const ltvUsd = arpuMonthlyUsd * (grossMarginPct / 100) * lifetimeMonths;
    const ltvToCacRatio = cacUsd > 0 ? ltvUsd / cacUsd : 0;
    const paybackPeriodMonths = arpuMonthlyUsd * (grossMarginPct / 100) > 0 ? cacUsd / (arpuMonthlyUsd * (grossMarginPct / 100)) : 0;

    return {
      cacUsd,
      ltvUsd: Math.round(ltvUsd * 100) / 100,
      ltvToCacRatio: Math.round(ltvToCacRatio * 100) / 100,
      paybackPeriodMonths: Math.round(paybackPeriodMonths * 10) / 10,
    };
  }
}
