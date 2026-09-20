import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OptimizeWorkforceScheduleDto {
  @ApiProperty({ description: 'Organization ID', example: 'org_enterprise_1001' })
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Week Number', example: 42 })
  @IsNumber()
  @Min(1)
  weekNumber: number;
}
