import { IsString, IsDateString } from 'class-validator';

export class VerifyLicenseDto {
  @IsString()
  providerId!: string;

  @IsString()
  licenseNumber!: string;

  @IsString()
  issuingStateAuthority!: string;

  @IsString()
  tradeCategory!: string;

  @IsDateString()
  expirationDate!: string;
}
