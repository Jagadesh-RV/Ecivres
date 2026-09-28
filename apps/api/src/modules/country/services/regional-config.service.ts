import { Injectable, Logger } from '@nestjs/common';

export interface RegionalConfig {
  countryCode: string;
  countryName: string;
  currency: string;
  symbol: string;
  defaultLanguage: string;
  supportedPaymentMethods: string[];
  taxType: 'VAT' | 'GST' | 'SALES_TAX';
  defaultTaxRatePercent: number;
}

@Injectable()
export class RegionalConfigService {
  private readonly logger = new Logger(RegionalConfigService.name);

  private readonly configs: Record<string, RegionalConfig> = {
    US: { countryCode: 'US', countryName: 'United States', currency: 'USD', symbol: '$', defaultLanguage: 'en', supportedPaymentMethods: ['STRIPE', 'APPLE_PAY', 'GOOGLE_PAY', 'PAYPAL'], taxType: 'SALES_TAX', defaultTaxRatePercent: 8.5 },
    IN: { countryCode: 'IN', countryName: 'India', currency: 'INR', symbol: '₹', defaultLanguage: 'hi', supportedPaymentMethods: ['RAZORPAY', 'UPI', 'STRIPE', 'BANK_TRANSFER'], taxType: 'GST', defaultTaxRatePercent: 18.0 },
    GB: { countryCode: 'GB', countryName: 'United Kingdom', currency: 'GBP', symbol: '£', defaultLanguage: 'en', supportedPaymentMethods: ['STRIPE', 'APPLE_PAY', 'PAYPAL'], taxType: 'VAT', defaultTaxRatePercent: 20.0 },
    AE: { countryCode: 'AE', countryName: 'United Arab Emirates', currency: 'AED', symbol: 'AED', defaultLanguage: 'ar', supportedPaymentMethods: ['STRIPE', 'APPLE_PAY'], taxType: 'VAT', defaultTaxRatePercent: 5.0 },
    DE: { countryCode: 'DE', countryName: 'Germany', currency: 'EUR', symbol: '€', defaultLanguage: 'de', supportedPaymentMethods: ['STRIPE', 'PAYPAL', 'SEPA'], taxType: 'VAT', defaultTaxRatePercent: 19.0 },
  };

  getRegionalConfig(countryCode: string): RegionalConfig {
    const config = this.configs[countryCode.toUpperCase()] || this.configs['US'];
    this.logger.log(`Retrieved regional config for ${countryCode} -> ${config.countryName} (${config.currency})`);
    return config;
  }
}
