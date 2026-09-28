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
}
