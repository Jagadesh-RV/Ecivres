import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OcrDocumentService } from './services/ocr-document.service';

@ApiTags('ocr')
@Controller('ocr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OcrController {
  constructor(private readonly ocrService: OcrDocumentService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload document for OCR scanning' })
  async upload(@Body() body: { userId: string; documentType: string; rawText: string }) {
    return this.ocrService.processDocumentUpload(body.userId, body.documentType, body.rawText);
  }

  @Get('documents/:id/invoice')
  @ApiOperation({ summary: 'Extract structured invoice data' })
  async getInvoice(@Param('id') id: string) {
    return this.ocrService.extractInvoice(id);
  }

  @Get('documents/:id/receipt')
  @ApiOperation({ summary: 'Parse store receipt data' })
  async getReceipt(@Param('id') id: string) {
    return this.ocrService.parseReceipt(id);
  }

  @Get('documents/:id/license')
  @ApiOperation({ summary: 'Extract business license metadata' })
  async getLicense(@Param('id') id: string) {
    return this.ocrService.extractBusinessLicense(id);
  }
}
