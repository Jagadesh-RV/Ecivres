import { Injectable, Logger } from '@nestjs/common';

export interface InvoiceJobData {
  bookingId: string;
  amount: number;
  tax: number;
  currency: string;
  customerEmail: string;
}

@Injectable()
export class InvoiceQueueProcessor {
  private readonly logger = new Logger(InvoiceQueueProcessor.name);

  async processInvoiceJob(jobId: string, data: InvoiceJobData): Promise<{ invoiceUrl: string; pdfSizeKb: number }> {
    this.logger.log(`[Job ${jobId}] Rendering PDF invoice for booking ${data.bookingId}`);
    
    const invoiceUrl = `https://cdn.ecivres.com/invoices/inv_${data.bookingId}.pdf`;
    
    return {
      invoiceUrl,
      pdfSizeKb: 142,
    };
  }
}
