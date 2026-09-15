import { Injectable, Logger } from '@nestjs/common';

export interface ConsolidatedCorporateInvoice {
  invoiceId: string;
  workspaceId: string;
  billingPeriod: string;
  totalBookingsCount: number;
  subtotalAmount: number;
  taxAmount: number;
  grandTotal: number;
  pdfDownloadUrl: string;
}

@Injectable()
export class CorporateInvoiceService {
  private readonly logger = new Logger(CorporateInvoiceService.name);

  async generateMonthlyInvoice(workspaceId: string, billingPeriod: string): Promise<ConsolidatedCorporateInvoice> {
    const invoiceId = `cinv_${workspaceId}_${billingPeriod}`;
    this.logger.log(`Generated consolidated monthly corporate invoice '${invoiceId}' for period ${billingPeriod}`);

    const subtotalAmount = 4500;
    const taxAmount = 450;

    return {
      invoiceId,
      workspaceId,
      billingPeriod,
      totalBookingsCount: 28,
      subtotalAmount,
      taxAmount,
      grandTotal: subtotalAmount + taxAmount,
      pdfDownloadUrl: `https://cdn.ecivres.com/corporate-invoices/${invoiceId}.pdf`,
    };
  }
}
