import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GenerateMaintenanceScheduleDto {
  @IsString()
  propertyId!: string;

  @IsNumber()
  @Min(1900)
  @Max(2100)
  propertyAgeYears!: number;

  @IsOptional()
  @IsNumber()
  squareFeet?: number;

  @IsOptional()
  @IsString()
  climateZone?: string;
}
