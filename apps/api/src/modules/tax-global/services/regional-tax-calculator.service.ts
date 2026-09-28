import { Injectable, Logger } from '@nestjs/common';

export interface TaxCalculationResult {
  subtotalAmount: number;
  taxType: 'VAT' | 'GST' | 'SALES_TAX';
  taxRatePercent: number;
  taxAmount: number;
  totalAmountWithTax: number;
}

@Injectable()
export class RegionalTaxCalculatorService {
  private readonly logger = new Logger(RegionalTaxCalculatorService.name);

  calculateTax(subtotalAmount: number, taxType: 'VAT' | 'GST' | 'SALES_TAX', taxRatePercent: number): TaxCalculationResult {
    const taxAmount = Number(((subtotalAmount * taxRatePercent) / 100).toFixed(2));
    const totalAmountWithTax = Number((subtotalAmount + taxAmount).toFixed(2));

    this.logger.log(`Calculated ${taxType} (${taxRatePercent}%): Subtotal=$${subtotalAmount}, Tax=$${taxAmount}, Total=$${totalAmountWithTax}`);
    return {
      subtotalAmount,
      taxType,
      taxRatePercent,
      taxAmount,
      totalAmountWithTax,
    };
  }

  validateBusinessTaxId(countryCode: string, taxId: string) {
    let isValid = false;
    const cleanId = taxId.trim().toUpperCase();

    if (countryCode === 'IN') {
      isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanId); // Indian GSTIN Regex
    } else if (countryCode === 'US') {
      isValid = /^\d{2}-\d{7}$/.test(cleanId); // US EIN Regex
    } else if (countryCode === 'GB') {
      isValid = /^GB\d{9}$/.test(cleanId); // UK VAT Regex
    } else {
      isValid = cleanId.length >= 6;
    }

    this.logger.log(`Tax ID validation for ${countryCode} (${taxId}): Valid=${isValid}`);
    return { countryCode, taxId, isValid };
  }
}
