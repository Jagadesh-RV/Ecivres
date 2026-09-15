import { Injectable, Logger } from '@nestjs/common';

export interface RegionalTaxCalculation {
  countryCode: string;
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  totalWithTax: number;
  taxName: string; // VAT, GST, Sales Tax
}

@Injectable()
export class RegionalTaxService {
  private readonly logger = new Logger(RegionalTaxService.name);

  calculateRegionalTax(amount: number, countryCode: string): RegionalTaxCalculation {
    let taxRatePercent = 0.0;
    let taxName = 'Sales Tax';

    switch (countryCode.toUpperCase()) {
      case 'US':
        taxRatePercent = 8.25;
        taxName = 'State Sales Tax';
        break;
      case 'GB':
      case 'UK':
        taxRatePercent = 20.0;
        taxName = 'VAT';
        break;
      case 'IN':
        taxRatePercent = 18.0;
        taxName = 'GST';
        break;
      case 'DE':
      case 'FR':
        taxRatePercent = 19.0;
        taxName = 'EU VAT';
        break;
      default:
        taxRatePercent = 10.0;
        taxName = 'Standard Tax';
    }

    const taxAmount = Math.round(amount * (taxRatePercent / 100) * 100) / 100;
    this.logger.log(`Calculated ${taxName} (${taxRatePercent}%) for ${countryCode}: \$${taxAmount}`);

    return {
      countryCode: countryCode.toUpperCase(),
      subtotal: amount,
      taxRatePercent,
      taxAmount,
      totalWithTax: amount + taxAmount,
      taxName,
    };
  }
}
