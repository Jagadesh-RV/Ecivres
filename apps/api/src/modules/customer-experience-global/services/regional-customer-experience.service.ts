import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RegionalCustomerExperienceService {
  private readonly logger = new Logger(RegionalCustomerExperienceService.name);

  getRegionalPromotions(countryCode: string) {
    this.logger.log(`Fetching active regional promotions for ${countryCode}`);
    if (countryCode === 'IN') {
      return [
        { promoCode: 'FESTIVE500', title: 'Diwali Home Cleaning Special', discountAmountUsd: 6.0, currency: 'INR', description: 'Get ₹500 off on deep home cleaning' },
      ];
    }
    if (countryCode === 'US') {
      return [
        { promoCode: 'FALL2026', title: 'Autumn HVAC Maintenance', discountAmountUsd: 25.0, currency: 'USD', description: 'Get $25 off seasonal furnace tune-up' },
      ];
    }
    return [
      { promoCode: 'GLOBAL15', title: 'Welcome to EcivreS', discountAmountUsd: 15.0, currency: 'USD', description: 'Instant $15 credit on first booking' },
    ];
  }

  getLocalizedPricing(baseAmountUsd: number, countryCode: string) {
    const rates: Record<string, { currency: string; rate: number; symbol: string }> = {
      IN: { currency: 'INR', rate: 83.5, symbol: '₹' },
      GB: { currency: 'GBP', rate: 0.79, symbol: '£' },
      AE: { currency: 'AED', rate: 3.67, symbol: 'AED' },
      DE: { currency: 'EUR', rate: 0.92, symbol: '€' },
      US: { currency: 'USD', rate: 1.0, symbol: '$' },
    };

    const target = rates[countryCode.toUpperCase()] || rates['US'];
    const convertedAmount = Math.round(baseAmountUsd * target.rate);
    this.logger.log(`Localized pricing $${baseAmountUsd} USD -> ${target.symbol}${convertedAmount} ${target.currency}`);

    return {
      baseAmountUsd,
      countryCode,
      currency: target.currency,
      convertedAmount,
      formattedPrice: `${target.symbol}${convertedAmount.toLocaleString()}`,
    };
  }
}
