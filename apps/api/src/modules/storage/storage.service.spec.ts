import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'AWS_S3_BUCKET') return 'test-bucket';
              return 'mock-val';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should pass validation for allowed mime type and size', () => {
      expect(service.validateFile('image/png', 1024 * 1024)).toBe(true);
    });

    it('should throw BadRequestException for disallowed mime type', () => {
      expect(() => service.validateFile('application/exe', 1024)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if file exceeds size limit', () => {
      expect(() => service.validateFile('image/jpeg', 15 * 1024 * 1024)).toThrow(BadRequestException);
    });
  });

  describe('generatePresignedUploadUrl', () => {
    it('should return presigned upload payload', async () => {
      const result = await service.generatePresignedUploadUrl(
        {
          filename: 'avatar.png',
          contentType: 'image/png',
          fileSize: 50000,
          category: 'profile',
        },
        'user-1',
      );

      expect(result).toHaveProperty('uploadUrl');
      expect(result).toHaveProperty('publicUrl');
      expect(result.fileKey).toContain('profile/user-1/');
    });
  });
});
