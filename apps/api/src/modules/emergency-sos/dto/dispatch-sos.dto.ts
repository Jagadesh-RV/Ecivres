import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DispatchSosDto {
  @ApiProperty({ description: 'Customer ID', example: 'cust_707' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Emergency Service Category', example: 'PLUMBING_FLOOD' })
  @IsString()
  serviceCategory: string;

  @ApiProperty({ description: 'Customer Latitude', example: 37.7749 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Customer Longitude', example: -122.4194 })
  @IsNumber()
  longitude: number;
}
