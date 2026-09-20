import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardFranchiseNetworkDto {
  @ApiProperty({ description: 'Region Code', example: 'US-EAST-1' })
  @IsString()
  regionCode: string;

  @ApiProperty({ description: 'Franchise Network Name', example: 'Metro HVAC Franchise Network' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Royalty Rate (0.0 - 0.50)', example: 0.08 })
  @IsNumber()
  @Min(0)
  royaltyRate: number;
}
