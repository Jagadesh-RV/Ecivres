import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum ClaimType {
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',
  WATER_DISASTER = 'WATER_DISASTER',
  ELECTRICAL_FAILURE = 'ELECTRICAL_FAILURE',
  VEHICLE_ACCIDENT = 'VEHICLE_ACCIDENT',
}

export class CreateClaimDto {
  @IsString()
  policyNumber!: string;

  @IsString()
  policyHolderId!: string;

  @IsString()
  bookingId!: string;

  @IsEnum(ClaimType)
  claimType!: ClaimType;

  @IsNumber()
  @Min(0)
  estimatedDamageUsd!: number;

  @IsOptional()
  @IsString()
  incidentDescription?: string;
}
