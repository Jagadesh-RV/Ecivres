import { IsNotEmpty, IsString, IsUrl, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VerificationDocumentType {
  GOVERNMENT_ID = 'GOVERNMENT_ID',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  INSURANCE_CERTIFICATE = 'INSURANCE_CERTIFICATE',
  TRADE_CERTIFICATION = 'TRADE_CERTIFICATION',
}

export class UploadVerificationDocumentDto {
  @ApiProperty({ enum: VerificationDocumentType, description: 'Document classification' })
  @IsEnum(VerificationDocumentType)
  documentType: VerificationDocumentType;

  @ApiProperty({ description: 'S3 Document URL' })
  @IsUrl({}, { message: 'Document URL must be a valid URL' })
  @IsNotEmpty()
  documentUrl: string;
}
