import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DayScheduleDto {
  @IsString()
  day: string; // 'MONDAY', 'TUESDAY', etc.

  @IsBoolean()
  isOpen: boolean;

  @IsString()
  @IsOptional()
  openTime?: string; // '09:00'

  @IsString()
  @IsOptional()
  closeTime?: string; // '17:00'
}

export class CreateAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  schedule: DayScheduleDto[];
}
