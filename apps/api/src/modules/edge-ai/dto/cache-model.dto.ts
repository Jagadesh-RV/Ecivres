import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CacheEdgeModelDto {
  @ApiProperty({ description: 'Target Edge Region Code', example: 'eu-central-1' })
  @IsString()
  region: string;

  @ApiProperty({ description: 'AI Model Identifier Key', example: 'recommendation-transformer-v2' })
  @IsString()
  modelKey: string;

  @ApiProperty({ description: 'Target Latency in Milliseconds', example: 8 })
  @IsNumber()
  @Min(1)
  latencyMs: number;
}
