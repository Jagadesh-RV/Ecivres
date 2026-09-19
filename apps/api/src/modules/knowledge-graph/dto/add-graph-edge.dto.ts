import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddGraphEdgeDto {
  @ApiProperty({ description: 'Source Entity', example: 'srv_hvac' })
  @IsString()
  sourceEntity: string;

  @ApiProperty({ description: 'Target Entity', example: 'srv_duct_cleaning' })
  @IsString()
  targetEntity: string;

  @ApiProperty({ description: 'Relationship Type', example: 'FREQUENTLY_BOOKED_WITH' })
  @IsString()
  relationship: string;

  @ApiProperty({ description: 'Relationship Weight', example: 0.85 })
  @IsNumber()
  @Min(0)
  weight: number;
}
