import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HoldEscrowDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'Amount to hold in escrow' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsString()
  @IsOptional()
  currency?: string;
}

export class ReleaseEscrowDto {
  @ApiProperty({ description: 'Escrow hold ID' })
  @IsString()
  @IsNotEmpty()
  escrowHoldId: string;
}
