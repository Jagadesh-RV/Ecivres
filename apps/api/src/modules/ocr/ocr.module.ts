import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OcrDocumentService } from './services/ocr-document.service';
import { OcrController } from './ocr.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OcrController],
  providers: [OcrDocumentService],
  exports: [OcrDocumentService],
})
export class OcrModule {}
