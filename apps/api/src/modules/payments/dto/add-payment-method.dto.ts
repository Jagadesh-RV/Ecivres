import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class AddPaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  cardholderName: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  last4: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expMonth: number;

  @IsNumber()
  @Min(2024)
  expYear: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
