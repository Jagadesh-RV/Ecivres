import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EmergencyTypeEnum {
  PLUMBING_LEAK = 'PLUMBING_LEAK',
  POWER_OUTAGE = 'POWER_OUTAGE',
  LOCKOUT = 'LOCKOUT',
  HVAC_FAILURE = 'HVAC_FAILURE',
}

export class EmergencyDispatchDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ enum: EmergencyTypeEnum, description: 'Type of emergency' })
  @IsEnum(EmergencyTypeEnum)
  emergencyType: EmergencyTypeEnum;

  @ApiProperty({ description: 'Address ID' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ description: 'Latitude coordinate' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  @IsNumber()
  longitude: number;
}
