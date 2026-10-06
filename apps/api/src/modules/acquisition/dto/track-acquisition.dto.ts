import { IsString, IsOptional, IsNumber } from 'class-validator';

export class TrackAcquisitionDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  utmSource?: string;

  @IsOptional()
  @IsString()
  utmMedium?: string;

  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @IsOptional()
  @IsString()
  utmContent?: string;

  @IsOptional()
  @IsString()
  referrerUrl?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsOptional()
  @IsNumber()
  acquisitionCost?: number;
}
