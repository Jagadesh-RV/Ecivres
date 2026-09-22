import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { OcrDocumentService } from './services/ocr-document.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OcrDocumentService', () => {
  let service: OcrDocumentService;

  const mockPrisma = {
    ocrExtractedDocument: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcrDocumentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OcrDocumentService>(OcrDocumentService);
  });

  it('should process OCR document upload with 96% confidence', async () => {
    mockPrisma.ocrExtractedDocument.create.mockResolvedValue({
      documentId: 'doc_1',
      userId: 'usr_1',
      confidence: 0.96,
      status: 'PARSED',
    });

    const res = await service.processDocumentUpload('usr_1', 'INVOICE', 'TOTAL $450');
    expect(res.documentId).toBe('doc_1');
    expect(res.confidence).toBe(0.96);
  });

  it('should extract structured invoice data accurately', async () => {
    const res = await service.extractInvoice('doc_1');
    expect(res.invoiceNumber).toBe('INV-2026-9081');
    expect(res.totalAmountUSD).toBe(450.0);
  });
});
