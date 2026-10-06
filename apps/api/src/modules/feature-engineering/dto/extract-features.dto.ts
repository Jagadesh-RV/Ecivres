import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum FeatureTimeframe {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class ExtractFeaturesDto {
  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(FeatureTimeframe)
  @IsOptional()
  timeframe?: FeatureTimeframe = FeatureTimeframe.DAILY;
}
