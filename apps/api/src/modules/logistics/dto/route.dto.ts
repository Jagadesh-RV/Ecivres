import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OptimizeRouteDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'Array of route waypoints' })
  @IsArray()
  waypoints: any[];
}
