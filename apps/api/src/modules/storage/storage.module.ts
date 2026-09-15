import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { SignedUrlService } from './signed-url.service';
import { ImageOptimizerService } from './image-optimizer.service';

@Global()
@Module({
  controllers: [StorageController],
  providers: [StorageService, SignedUrlService, ImageOptimizerService],
  exports: [StorageService, SignedUrlService, ImageOptimizerService],
})
export class StorageModule {}
