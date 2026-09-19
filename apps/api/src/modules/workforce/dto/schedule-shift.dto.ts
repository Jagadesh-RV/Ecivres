import { IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleShiftDto {
  @ApiProperty({ description: 'Organization ID', example: 'org_acme' })
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Staff Member User ID', example: 'staff_505' })
  @IsString()
  staffId: string;

  @ApiProperty({ description: 'Shift Start Time', example: '2026-10-01T08:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'Shift End Time', example: '2026-10-01T17:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'Expected Overtime Hours', example: 1.0 })
  @IsNumber()
  @Min(0)
  overtimeHours: number;
}
