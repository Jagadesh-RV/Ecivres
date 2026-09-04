import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class RequestPayoutDto {
  @IsNumber()
  @Min(10)
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankAccountName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  routingNumber: string;
}
