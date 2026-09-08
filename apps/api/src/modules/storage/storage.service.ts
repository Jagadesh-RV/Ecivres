import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
  category: 'profile' | 'service' | 'verification' | 'attachment';
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;

  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];
  private readonly MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'mock_access_key';
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'mock_secret_key';

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'ecivres-uploads';

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  validateFile(contentType: string, fileSize: number) {
    if (!this.ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new BadRequestException(
        `Invalid file type "${contentType}". Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (fileSize > this.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
      );
    }

    return true;
  }

  async generatePresignedUploadUrl(req: PresignedUrlRequest, userId: string) {
    this.validateFile(req.contentType, req.fileSize);

    const cleanFilename = req.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const key = `${req.category}/${userId}/${timestamp}-${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: req.contentType,
    });

    let uploadUrl: string;
    try {
      uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
    } catch (err) {
      this.logger.warn(`Failed AWS S3 presigning, returning fallback mock URL for local dev: ${err}`);
      uploadUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}?mock_signature=true`;
    }

    const publicUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

    return {
      uploadUrl,
      publicUrl,
      fileKey: key,
      expiresInSeconds: 900,
    };
  }

  async generatePresignedReadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (err) {
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }
  }
}
