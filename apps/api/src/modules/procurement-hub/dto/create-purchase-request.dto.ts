import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseRequestDto {
  @ApiProperty({ description: 'Organization ID', example: 'org_corp_200' })
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Item Description', example: '100x Industrial Air Filter Units' })
  @IsString()
  itemDescription: string;

  @ApiProperty({ description: 'Estimated Procurement Cost in USD', example: 4500.0 })
  @IsNumber()
  @Min(10)
  estimatedCost: number;
}
