import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CurrencyMathService, MoneyValue } from './currency-math.service';

export interface ConvertedMoneyResult {
  original: MoneyValue;
  converted: MoneyValue;
  exchangeRate: number;
  rateProvider: string;
  effectiveAt: Date;
}

@Injectable()
export class CurrencyConversionService {
  private readonly logger = new Logger(CurrencyConversionService.name);
  private readonly rateCache = new Map<string, { rate: number; validUntil: number; provider: string }>();

  // Default fallback exchange rates relative to USD
  private readonly defaultRatesToUSD: Record<string, number> = {
    USD: 1.0,
    EUR: 1.08,
    GBP: 1.28,
    INR: 0.012,
    AED: 0.272,
    CAD: 0.74,
    AUD: 0.66,
    SGD: 0.75,
    JPY: 0.0067,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly mathService: CurrencyMathService,
  ) {}

  /**
   * Sets or overrides an exchange rate in cache and database.
   */
  async setExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    validHours: number = 24,
    provider: string = 'PLATFORM_TREASURY',
  ): Promise<void> {
    const key = `${fromCurrency.toUpperCase()}_${toCurrency.toUpperCase()}`;
    const validUntil = Date.now() + validHours * 3600 * 1000;

    this.rateCache.set(key, { rate, validUntil, provider });

    try {
      await this.prisma.exchangeRateRecord.create({
        data: {
          fromCurrency: fromCurrency.toUpperCase(),
          toCurrency: toCurrency.toUpperCase(),
          rate,
          provider,
          validUntil: new Date(validUntil),
        },
      });
    } catch {}

    this.logger.log(`Set exchange rate ${key} = ${rate} (valid ${validHours}h)`);
  }

  /**
   * Resolves rate between two currencies.
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number; provider: string }> {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    if (from === to) {
      return { rate: 1.0, provider: 'IDENTITY' };
    }

    const key = `${from}_${to}`;
    const cached = this.rateCache.get(key);

    if (cached && cached.validUntil > Date.now()) {
      return { rate: cached.rate, provider: cached.provider };
    }

    // Try DB lookup
    try {
      const record = await this.prisma.exchangeRateRecord.findFirst({
        where: {
          fromCurrency: from,
          toCurrency: to,
          validUntil: { gt: new Date() },
        },
        orderBy: { effectiveAt: 'desc' },
      });

      if (record) {
        this.rateCache.set(key, {
          rate: record.rate,
          validUntil: record.validUntil.getTime(),
          provider: record.provider,
        });
        return { rate: record.rate, provider: record.provider };
      }
    } catch {}

    // Fallback to cross-rates via USD base
    const fromUSD = this.defaultRatesToUSD[from];
    const toUSD = this.defaultRatesToUSD[to];

    if (fromUSD && toUSD) {
      const crossRate = fromUSD / toUSD;
      return { rate: crossRate, provider: 'MARKET_TREASURY_FALLBACK' };
    }

    throw new NotFoundException(`Exchange rate from '${from}' to '${to}' is unavailable.`);
  }

  /**
   * Converts monetary value from one currency to another safely using minor-unit arithmetic.
   */
  async convert(amount: MoneyValue, targetCurrency: string): Promise<ConvertedMoneyResult> {
    const from = amount.currency.toUpperCase();
    const to = targetCurrency.toUpperCase();

    if (from === to) {
      return {
        original: amount,
        converted: amount,
        exchangeRate: 1.0,
        rateProvider: 'IDENTITY',
        effectiveAt: new Date(),
      };
    }

    const { rate, provider } = await this.getExchangeRate(from, to);

    // Convert major amounts then format to minor units of target
    const majorFrom = this.mathService.toMajorUnits(amount);
    const majorTo = majorFrom * rate;
    const converted = this.mathService.fromMajorUnits(majorTo, to);

    return {
      original: amount,
      converted,
      exchangeRate: rate,
      rateProvider: provider,
      effectiveAt: new Date(),
    };
  }
}
