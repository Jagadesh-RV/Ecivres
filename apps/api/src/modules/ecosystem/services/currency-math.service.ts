import { Injectable, BadRequestException } from '@nestjs/common';

export interface MoneyValue {
  minorUnits: number; // Integer representation (e.g. 1050 cents = $10.50)
  currency: string;   // ISO 4217 (USD, EUR, GBP, INR, JPY)
}

export type RoundingMode = 'HALF_EVEN' | 'HALF_UP' | 'CEIL' | 'FLOOR';

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
    JPY: 0,
    KRW: 0,
    KWD: 3,
    BHD: 3,
  };

  private readonly currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AED: 'AED ',
    CAD: 'CA$',
    AUD: 'A$',
    SGD: 'S$',
    JPY: '¥',
  };

  getDecimals(currency: string): number {
    return this.currencyDecimals[currency.toUpperCase()] ?? 2;
  }

  getSymbol(currency: string): string {
    return this.currencySymbols[currency.toUpperCase()] ?? `${currency.toUpperCase()} `;
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

  multiplyBasisPoints(money: MoneyValue, basisPoints: number, mode: RoundingMode = 'HALF_UP'): MoneyValue {
    const raw = (money.minorUnits * basisPoints) / 10000;
    let rounded: number;

    switch (mode) {
      case 'CEIL':
        rounded = Math.ceil(raw);
        break;
      case 'FLOOR':
        rounded = Math.floor(raw);
        break;
      case 'HALF_EVEN': {
        const floor = Math.floor(raw);
        const diff = raw - floor;
        if (diff === 0.5) {
          rounded = floor % 2 === 0 ? floor : floor + 1;
        } else {
          rounded = Math.round(raw);
        }
        break;
      }
      case 'HALF_UP':
      default:
        rounded = Math.round(raw);
        break;
    }

    return {
      minorUnits: rounded,
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

  /**
   * Formats money into a localized display representation.
   */
  formatDisplay(money: MoneyValue, locale: string = 'en-US'): string {
    const major = this.toMajorUnits(money);
    const decimals = this.getDecimals(money.currency);
    const symbol = this.getSymbol(money.currency);

    const formattedNumber = major.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return `${symbol}${formattedNumber}`;
  }

  private assertSameCurrency(a: MoneyValue, b: MoneyValue): void {
    if (a.currency.toUpperCase() !== b.currency.toUpperCase()) {
      throw new BadRequestException(
        `Currency mismatch: Cannot compute between '${a.currency}' and '${b.currency}'. Use currency conversion first.`,
      );
    }
  }
}
