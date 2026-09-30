import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  discountType: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  discountValue: number;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @IsNumber()
  totalBudget: number;

  @IsOptional()
  @IsNumber()
  maxRedemptions?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  targetCategory?: string;

  @IsOptional()
  @IsString()
  targetCountry?: string;
}

export class RedeemCampaignDto {
  @IsString()
  code: string;

  @IsString()
  userId: string;

  @IsNumber()
  orderAmount: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
