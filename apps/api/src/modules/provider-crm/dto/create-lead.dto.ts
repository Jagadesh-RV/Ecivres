import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrmRecordDto {
  @ApiProperty({ description: 'Provider ID', example: 'prov_1001' })
  @IsString()
  providerId: string;

  @ApiProperty({ description: 'Customer ID', example: 'cust_2002' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Customer Lead Score (0-100)', example: 85 })
  @IsNumber()
  leadScore: number;

  @ApiProperty({ description: 'Notes on customer preferences', example: 'Prefers morning appointments' })
  @IsOptional()
  @IsString()
  notes?: string;
}
