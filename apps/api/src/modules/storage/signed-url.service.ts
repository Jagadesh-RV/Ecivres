import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SignedUrlService {
  private readonly logger = new Logger(SignedUrlService.name);

  generatePresignedUploadUrl(bucket: string, key: string, expiresInSeconds = 900): { uploadUrl: string; key: string; expiresAt: string } {
    this.logger.log(`Generating presigned upload URL for s3://${bucket}/${key}`);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    return {
      uploadUrl: `https://${bucket}.s3.amazonaws.com/${key}?X-Amz-Signature=mock_signature&X-Amz-Expires=${expiresInSeconds}`,
      key,
      expiresAt,
    };
  }

  generatePresignedDownloadUrl(cdnHost: string, key: string, expiresInSeconds = 3600): string {
    return `https://${cdnHost}/${key}?token=mock_cdn_token&expires=${Math.floor(Date.now() / 1000) + expiresInSeconds}`;
  }
}
