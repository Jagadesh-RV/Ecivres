import { Injectable, BadRequestException } from '@nestjs/common';

export interface MoneyValue {
  minorUnits: number; // Integer representation (e.g. 1050 cents = $10.50)
  currency: string;   // ISO 4217 (USD, EUR, GBP, INR, JPY)
}

@Injectable()
export class CurrencyMathService {
  // Minor unit decimal places for ISO currencies
  private readonly currencyDecimals: Record<string, number> = {
    USD: 2,
    EUR: 2,
    GBP: 2,
    INR: 2,
    AED: 2,
    CAD: 2,
    AUD: 2,
    SGD: 2,
    JPY: 0, // Zero-decimal currency
    KRW: 0,
    KWD: 3, // Three-decimal currency
    BHD: 3,
  };

  getDecimals(currency: string): number {
    return this.currencyDecimals[currency.toUpperCase()] ?? 2;
  }

  fromMajorUnits(amount: number, currency: string): MoneyValue {
    const decimals = this.getDecimals(currency);
    const multiplier = Math.pow(10, decimals);
    return {
      minorUnits: Math.round(amount * multiplier),
      currency: currency.toUpperCase(),
    };
  }

  toMajorUnits(money: MoneyValue): number {
    const decimals = this.getDecimals(money.currency);
    const divisor = Math.pow(10, decimals);
    return money.minorUnits / divisor;
  }

  add(a: MoneyValue, b: MoneyValue): MoneyValue {
    this.assertSameCurrency(a, b);
    return {
      minorUnits: a.minorUnits + b.minorUnits,
      currency: a.currency,
    };
  }

  subtract(a: MoneyValue, b: MoneyValue): MoneyValue {
    this.assertSameCurrency(a, b);
    return {
      minorUnits: a.minorUnits - b.minorUnits,
      currency: a.currency,
    };
  }

  multiplyBasisPoints(money: MoneyValue, basisPoints: number): MoneyValue {
    // 10,000 basis points = 100%
    const result = Math.round((money.minorUnits * basisPoints) / 10000);
    return {
      minorUnits: result,
      currency: money.currency,
    };
  }

  /**
   * Distributes an amount proportionally without losing a single cent due to rounding remainders.
   */
  distributeProportions(money: MoneyValue, ratios: number[]): MoneyValue[] {
    const totalRatio = ratios.reduce((sum, r) => sum + r, 0);
    if (totalRatio <= 0) {
      throw new BadRequestException('Total ratio must be greater than zero.');
    }

    let remainder = money.minorUnits;
    const results: MoneyValue[] = [];

    for (let i = 0; i < ratios.length; i++) {
      const share = Math.floor((money.minorUnits * ratios[i]) / totalRatio);
      results.push({ minorUnits: share, currency: money.currency });
      remainder -= share;
    }

    // Distribute remainder 1 cent at a time to highest-ratio recipients
    let idx = 0;
    while (remainder > 0) {
      results[idx % results.length].minorUnits += 1;
      remainder -= 1;
      idx += 1;
    }

    return results;
  }

  private assertSameCurrency(a: MoneyValue, b: MoneyValue): void {
    if (a.currency.toUpperCase() !== b.currency.toUpperCase()) {
      throw new BadRequestException(
        `Currency mismatch: Cannot compute between '${a.currency}' and '${b.currency}'. Use currency conversion first.`,
      );
    }
  }
}
