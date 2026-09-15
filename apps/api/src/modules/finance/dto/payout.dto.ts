import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstantPayoutRequestDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'Amount to withdraw' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Destination bank account or card identifier' })
  @IsString()
  @IsNotEmpty()
  destinationAccount: string;
}
