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
}
