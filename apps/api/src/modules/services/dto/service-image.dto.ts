import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadServiceImageDto {
  @ApiProperty({ description: 'S3 Public URL for service showcase image' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Optional image caption or title', required: false })
  @IsString()
  @IsOptional()
  caption?: string;
}
