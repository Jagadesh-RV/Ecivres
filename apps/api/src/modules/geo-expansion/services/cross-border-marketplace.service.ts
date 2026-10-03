import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CrossBorderMarketplaceService {
  private readonly logger = new Logger(CrossBorderMarketplaceService.name);

  calculateCrossBorderSettlement(sourceAmount: number, sourceCurrency: string, targetCurrency: string) {
    this.logger.log(`Calculating cross-border FX settlement: ${sourceAmount} ${sourceCurrency} -> ${targetCurrency}`);

    let fxRate = 1.0;
    if (sourceCurrency === 'USD' && targetCurrency === 'EUR') fxRate = 0.92;
    else if (sourceCurrency === 'USD' && targetCurrency === 'GBP') fxRate = 0.78;
    else if (sourceCurrency === 'EUR' && targetCurrency === 'USD') fxRate = 1.09;
    else if (sourceCurrency === 'GBP' && targetCurrency === 'USD') fxRate = 1.28;

    const fxFeePct = 1.5;
    const targetAmount = sourceAmount * fxRate;
    const fxFeeAmount = (targetAmount * fxFeePct) / 100;
    const netSettlementAmount = targetAmount - fxFeeAmount;

    return {
      sourceAmount,
      sourceCurrency,
      targetCurrency,
      fxRate,
      targetAmount: Math.round(targetAmount * 100) / 100,
      fxFeePct,
      fxFeeAmount: Math.round(fxFeeAmount * 100) / 100,
      netSettlementAmount: Math.round(netSettlementAmount * 100) / 100,
    };
  }
}
