import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculatePayrollDto {
  @ApiProperty({ description: 'Staff Member ID' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ description: 'Total hours worked in period' })
  @IsNumber()
  hoursWorked: number;

  @ApiProperty({ description: 'Hourly wage rate' })
  @IsNumber()
  hourlyRate: number;

  @ApiPropertyOptional({ description: 'Optional bonus amount' })
  @IsNumber()
  @IsOptional()
  bonus?: number;
}
