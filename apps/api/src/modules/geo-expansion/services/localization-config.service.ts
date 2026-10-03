import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LocalizationConfigService {
  private readonly logger = new Logger(LocalizationConfigService.name);

  getRegionalConfig(countryCode: string) {
    this.logger.log(`Fetching localization & tax configuration for ${countryCode}`);
    const code = countryCode.toUpperCase();

    if (code === 'GB' || code === 'UK') {
      return { countryCode: 'GB', currency: 'GBP', language: 'en-GB', timeZone: 'Europe/London', defaultTaxRatePct: 20.0, taxName: 'VAT' };
    }
    if (code === 'DE' || code === 'FR' || code === 'EU') {
      return { countryCode: 'DE', currency: 'EUR', language: 'de-DE', timeZone: 'Europe/Berlin', defaultTaxRatePct: 19.0, taxName: 'VAT' };
    }
    if (code === 'CA') {
      return { countryCode: 'CA', currency: 'CAD', language: 'en-CA', timeZone: 'America/Toronto', defaultTaxRatePct: 13.0, taxName: 'HST' };
    }
    return { countryCode: 'US', currency: 'USD', language: 'en-US', timeZone: 'America/New_York', defaultTaxRatePct: 8.875, taxName: 'Sales Tax' };
  }
}
