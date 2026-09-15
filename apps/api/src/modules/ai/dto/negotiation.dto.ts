import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserFlexibilityEnum {
  STRICT = 'STRICT',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

export class OfferNegotiationDto {
  @ApiProperty({ description: 'Target Service ID' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ description: 'Original service price' })
  @IsNumber()
  originalPrice: number;

  @ApiProperty({ description: 'Customer target offer price' })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({ enum: UserFlexibilityEnum, description: 'Customer flexibility setting' })
  @IsEnum(UserFlexibilityEnum)
  userFlexibility: UserFlexibilityEnum;
}
