import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluateDeviceTrustDto {
  @ApiProperty({ description: 'Device fingerprint hash' })
  @IsString()
  @IsNotEmpty()
  fingerprint: string;

  @ApiProperty({ description: 'Client User-Agent string' })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({ description: 'Client IP address' })
  @IsString()
  @IsNotEmpty()
  ip: string;

  @ApiPropertyOptional({ description: 'User known registered fingerprints' })
  @IsArray()
  @IsOptional()
  knownFingerprints?: string[];
}
