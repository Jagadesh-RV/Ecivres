import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum IdentityType {
  INDIVIDUAL_CUSTOMER = 'INDIVIDUAL_CUSTOMER',
  CERTIFIED_PROVIDER = 'CERTIFIED_PROVIDER',
  ENTERPRISE_ORG = 'ENTERPRISE_ORG',
  GOVERNMENT_AUDITOR = 'GOVERNMENT_AUDITOR',
}

export class RegisterDigitalIdDto {
  @IsString()
  userId!: string;

  @IsEnum(IdentityType)
  identityType!: IdentityType;

  @IsString()
  didIdentifier!: string;

  @IsOptional()
  @IsString()
  publicKeyPem?: string;
}
