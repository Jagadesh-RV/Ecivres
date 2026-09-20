import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProcurementContractDto {
  @ApiProperty({ description: 'Organization ID', example: 'org_acme' })
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Vendor Name', example: 'Global Logistics Corp' })
  @IsString()
  vendorName: string;

  @ApiProperty({ description: 'Contract Budget in USD', example: 50000.0 })
  @IsNumber()
  @Min(100)
  totalBudget: number;
}
