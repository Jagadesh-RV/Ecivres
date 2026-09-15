import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateSlaRefundDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'Provider delay in minutes' })
  @IsNumber()
  delayMinutes: number;

  @ApiProperty({ description: 'Booking total amount' })
  @IsNumber()
  bookingAmount: number;
}
