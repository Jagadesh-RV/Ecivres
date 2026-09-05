import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class AvailabilityRuleDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.

  @IsString()
  startTime: string; // "09:00"

  @IsString()
  endTime: string;   // "18:00"

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;

  @IsOptional()
  @IsNumber()
  slotDurationMinutes?: number = 60;
}
