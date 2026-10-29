import { IsString, IsNotEmpty, IsArray, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerApiKeyDto {
  @ApiProperty({ description: 'Enterprise organization ID owning this key', example: 'org_12345' })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Human-readable key label', example: 'Mobile Partner POS Integration' })
  @IsString()
  @IsNotEmpty()
  keyName: string;

  @ApiProperty({ description: 'Allowed scope permissions', example: ['bookings:read', 'services:query', 'pricing:evaluate'] })
  @IsArray()
  scopes: string[];

  @ApiProperty({ description: 'Allowed requests per minute', default: 120 })
  @IsInt()
  @Min(10)
  @Max(5000)
  @IsOptional()
  rateLimitPerMin?: number = 120;

  @ApiProperty({ description: 'Key validity in days', default: 90 })
  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  expiresInDays?: number = 90;
}

export class RotatePartnerApiKeyDto {
  @ApiProperty({ description: 'Existing key ID to rotate' })
  @IsString()
  @IsNotEmpty()
  keyId: string;

  @ApiProperty({ description: 'Reason for rotation', example: 'Scheduled 90-day credential rotation' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class RevokePartnerApiKeyDto {
  @ApiProperty({ description: 'Key ID to revoke' })
  @IsString()
  @IsNotEmpty()
  keyId: string;

  @ApiProperty({ description: 'Reason for revocation', example: 'Partner integration deprecated' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class PartnerKeyCreatedResponseDto {
  @ApiProperty({ description: 'Key ID record' })
  keyId: string;

  @ApiProperty({ description: 'Key display prefix for identification', example: 'ecv_live_4a8f' })
  keyPrefix: string;

  @ApiProperty({ description: 'Full plaintext secret (ONLY RETURNED ONCE UPON CREATION)' })
  plaintextKey: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Scopes granted' })
  scopes: string[];

  @ApiProperty({ description: 'Rate limit requests/min' })
  rateLimitPerMin: number;

  @ApiProperty({ description: 'Expiration date' })
  expiresAt: Date;
}
