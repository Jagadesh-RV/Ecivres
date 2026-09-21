import { IsString, IsOptional } from 'class-validator';

export class StripeConfigDto {
  @IsString()
  secretKey: string;

  @IsString()
  webhookSecret: string;

  @IsOptional()
  @IsString()
  connectClientId?: string;
}
