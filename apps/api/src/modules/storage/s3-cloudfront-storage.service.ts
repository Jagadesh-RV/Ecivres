import { Injectable } from '@nestjs/common';

export interface PresignedUploadUrlResponse {
  uploadUrl: string;
  cdnUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

@Injectable()
export class S3CloudFrontStorageService {
  private bucketName = 'ecivres-media-production';
  private cdnDomain = 'https://cdn.ecivres.com';

  async generatePresignedUploadUrl(
    category: 'PORTFOLIO' | 'INVOICES' | 'DOCUMENTS' | 'AVATARS',
    fileName: string,
    contentType: string,
  ): Promise<PresignedUploadUrlResponse> {
    const fileKey = `${category.toLowerCase()}/${Date.now()}_${fileName}`;
    const uploadUrl = `https://${this.bucketName}.s3.amazonaws.com/${fileKey}?AWSAccessKeyId=MOCK_KEY&Signature=MOCK_SIG`;
    const cdnUrl = `${this.cdnDomain}/${fileKey}`;

    return {
      uploadUrl,
      cdnUrl,
      fileKey,
      expiresInSeconds: 900, // 15 minutes
    };
  }

  async getSignedCdnUrl(fileKey: string, expiryHours: number = 24): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiryHours * 3600;
    return `${this.cdnDomain}/${fileKey}?Signature=CloudFront_Signed_Token&Expires=${expires}`;
  }
}
