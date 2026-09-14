import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SignedUrlService } from './signed-url.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly signedUrlService: SignedUrlService) {}

  @Post('presigned-upload')
  getUploadUrl(@Body() body: { fileName: string; folder: string }) {
    const key = `${body.folder || 'uploads'}/${Date.now()}_${body.fileName}`;
    return this.signedUrlService.generatePresignedUploadUrl('ecivres-media-assets', key);
  }

  @Get('signed-cdn-url')
  getSignedCdnUrl(@Query('key') key: string) {
    return {
      cdnUrl: this.signedUrlService.generatePresignedDownloadUrl('cdn.ecivres.com', key),
    };
  }
}
