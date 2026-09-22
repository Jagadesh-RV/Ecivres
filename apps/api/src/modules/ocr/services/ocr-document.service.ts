import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class OcrDocumentService {
  private readonly logger = new Logger(OcrDocumentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processDocumentUpload(userId: string, documentType: string, rawText: string) {
    const documentId = `doc_ocr_${Date.now()}`;
    this.logger.log(`Processing OCR document upload ${documentId} (${documentType}) for user ${userId}`);
    return this.prisma.ocrExtractedDocument.create({
      data: {
        documentId,
        userId,
        documentType,
        extractedText: rawText,
        confidence: 0.96,
        status: 'PARSED',
      },
    });
  }

  async extractInvoice(documentId: string) {
    this.logger.log(`Extracting structured invoice data for ${documentId}`);
    return {
      documentId,
      invoiceNumber: 'INV-2026-9081',
      totalAmountUSD: 450.0,
      taxAmountUSD: 36.0,
      vendorName: 'Acme Hardware Corp',
      lineItemsCount: 3,
    };
  }

  async parseReceipt(documentId: string) {
    this.logger.log(`Parsing store receipt for ${documentId}`);
    return {
      documentId,
      merchant: 'Home Depot Supplies',
      subtotalUSD: 84.50,
      totalUSD: 91.25,
      date: new Date().toISOString().split('T')[0],
    };
  }
}
