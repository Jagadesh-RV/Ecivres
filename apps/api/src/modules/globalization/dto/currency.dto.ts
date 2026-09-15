import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyDto {
  @ApiProperty({ description: 'Amount to convert' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Base currency code (e.g. USD)' })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: 'Target currency code (e.g. EUR, INR)' })
  @IsString()
  @IsNotEmpty()
  to: string;
}
