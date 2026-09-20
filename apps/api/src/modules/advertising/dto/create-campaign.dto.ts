import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdCampaignDto {
  @ApiProperty({ description: 'Provider ID', example: 'prov_1001' })
  @IsString()
  providerId: string;

  @ApiProperty({ description: 'Campaign Title', example: 'Summer HVAC Special Ad' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Cost Per Click Bid in USD', example: 2.50 })
  @IsNumber()
  @Min(0.1)
  bidCpc: number;

  @ApiProperty({ description: 'Total Campaign Budget', example: 500.0 })
  @IsNumber()
  @Min(10)
  budget: number;
}
