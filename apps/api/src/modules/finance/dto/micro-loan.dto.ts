import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ApplyMicroLoanDto {
  @IsString()
  providerId!: string;

  @IsNumber()
  @Min(100)
  @Max(10000)
  requestedAmount!: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  repaymentTermMonths!: number;

  @IsOptional()
  @IsString()
  purpose?: string;
}
