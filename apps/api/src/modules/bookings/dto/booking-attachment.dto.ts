import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadBookingAttachmentDto {
  @ApiProperty({ description: 'Target Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'S3 Attachment URL' })
  @IsUrl({}, { message: 'File URL must be a valid URL' })
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  filename: string;
}
