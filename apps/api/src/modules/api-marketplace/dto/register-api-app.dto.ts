import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterApiAppDto {
  @ApiProperty({ description: 'Developer User ID', example: 'dev_909' })
  @IsString()
  developerId: string;

  @ApiProperty({ description: 'Application Name', example: 'Acme Integration App' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Rate Plan Tier', example: 'PRO', enum: ['FREE', 'PRO', 'ENTERPRISE'] })
  @IsIn(['FREE', 'PRO', 'ENTERPRISE'])
  ratePlan: string;
}
