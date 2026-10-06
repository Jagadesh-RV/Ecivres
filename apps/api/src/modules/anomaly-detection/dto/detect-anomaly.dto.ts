import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsObject } from 'class-validator';

export enum AnomalySeverityDto {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class DetectAnomalyDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(AnomalySeverityDto)
  severity: AnomalySeverityDto;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsObject()
  evidence: Record<string, any>;

  @IsNumber()
  @IsOptional()
  confidence?: number;

  @IsString()
  @IsNotEmpty()
  recommendedAction: string;
}
