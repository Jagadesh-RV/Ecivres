import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarketplaceRegionDto {
  @ApiProperty({ description: 'Two-letter ISO country code', example: 'US' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Full region display name', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Default currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Currency symbol', example: '$' })
  @IsString()
  @IsNotEmpty()
  currencySymbol: string;

  @ApiProperty({ description: 'Default locale identifier', example: 'en-US' })
  @IsString()
  @IsNotEmpty()
  defaultLocale: string;

  @ApiProperty({ description: 'Primary timezone identifier', example: 'America/New_York' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ description: 'Tax regime type', example: 'SALES_TAX' })
  @IsString()
  @IsNotEmpty()
  taxType: 'SALES_TAX' | 'GST' | 'VAT';

  @ApiProperty({ description: 'Default baseline tax rate percentage', example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultTaxRate: number;

  @ApiProperty({ description: 'Supported payment gateways in this region', example: ['STRIPE', 'APPLE_PAY'] })
  @IsArray()
  supportedGateways: string[];

  @ApiProperty({ description: 'Standard cancellation window in hours', default: 24 })
  @IsNumber()
  @IsOptional()
  cancellationWindowHours?: number = 24;
}

export class CalculateRegionalTaxDto {
  @ApiProperty({ description: 'Region code', example: 'GB' })
  @IsString()
  @IsNotEmpty()
  regionCode: string;

  @ApiProperty({ description: 'Subtotal in minor currency units (e.g. cents)' })
  @IsNumber()
  @Min(0)
  subtotalMinorUnits: number;

  @ApiProperty({ description: 'Currency code', example: 'GBP' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Postal/Zip code for sub-national tax jurisdiction', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class RegionalTaxResultDto {
  @ApiProperty({ description: 'Region code' })
  regionCode: string;

  @ApiProperty({ description: 'Tax regime (SALES_TAX, GST, VAT)' })
  taxType: string;

  @ApiProperty({ description: 'Effective tax rate percentage' })
  taxRatePercent: number;

  @ApiProperty({ description: 'Calculated tax amount in minor units' })
  taxMinorUnits: number;

  @ApiProperty({ description: 'Total amount inclusive of tax in minor units' })
  totalMinorUnits: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;
}
