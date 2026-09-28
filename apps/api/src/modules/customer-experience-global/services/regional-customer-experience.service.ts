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
}
