import { Injectable, Logger } from '@nestjs/common';

export interface CurrencyConversionResult {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  exchangeRate: number;
  convertedAmount: number;
}

@Injectable()
export class MultiCurrencyService {
  private readonly logger = new Logger(MultiCurrencyService.name);
  private readonly rates: Record<string, number> = {
    'USD_EUR': 0.92,
    'USD_GBP': 0.79,
    'USD_INR': 83.5,
    'USD_CAD': 1.36,
  };

  convertCurrency(amount: number, from = 'USD', to = 'EUR'): CurrencyConversionResult {
    const pair = `${from}_${to}`;
    const exchangeRate = this.rates[pair] || 1.0;
    const convertedAmount = Math.round(amount * exchangeRate * 100) / 100;

    this.logger.log(`Converted \$${amount} ${from} to ${convertedAmount} ${to} (Rate: ${exchangeRate})`);

    return {
      fromCurrency: from,
      toCurrency: to,
      originalAmount: amount,
      exchangeRate,
      convertedAmount,
    };
  }
}
