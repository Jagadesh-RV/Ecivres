import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateBiReportDto {
  @ApiProperty({ description: 'Report Title', example: 'Q4 2026 Executive Cohort Analysis' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Report Type', example: 'COHORT', enum: ['EXECUTIVE', 'COHORT', 'ATTRIBUTION', 'FORECAST'] })
  @IsIn(['EXECUTIVE', 'COHORT', 'ATTRIBUTION', 'FORECAST'])
  type: string;
}
