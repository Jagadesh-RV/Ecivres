import { IsNumber, IsBoolean, IsOptional, Min, Max, IsString } from 'class-validator';

export class UpdatePlatformSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  platformFeePercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  payoutMinimumThreshold?: number;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsString()
  systemAnnouncementMessage?: string;
}
