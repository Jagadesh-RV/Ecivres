import { Test, TestingModule } from '@nestjs/testing';
import { S3CloudFrontStorageService } from './s3-cloudfront-storage.service';

describe('S3CloudFrontStorageService', () => {
  let service: S3CloudFrontStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3CloudFrontStorageService],
    }).compile();

    service = module.get<S3CloudFrontStorageService>(S3CloudFrontStorageService);
  });

  it('should generate S3 pre-signed upload URLs and CloudFront CDN URLs', async () => {
    const res = await service.generatePresignedUploadUrl('PORTFOLIO', 'renovation.jpg', 'image/jpeg');
    expect(res.uploadUrl).toContain('s3.amazonaws.com');
    expect(res.cdnUrl).toContain('cdn.ecivres.com/portfolio/');
    expect(res.expiresInSeconds).toBe(900);
  });

  it('should generate signed CloudFront private URLs with expiration', async () => {
    const signedUrl = await service.getSignedCdnUrl('invoices/inv_100.pdf', 12);
    expect(signedUrl).toContain('cdn.ecivres.com/invoices/inv_100.pdf');
    expect(signedUrl).toContain('Signature=CloudFront_Signed_Token');
  });
});
