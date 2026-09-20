import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSmartEscrowDto {
  @ApiProperty({ description: 'Booking ID', example: 'bk_1001' })
  @IsString()
  bookingId: string;

  @ApiProperty({ description: 'Escrow Amount in USD', example: 500.0 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Milestone Name', example: 'Phase 1 Completion' })
  @IsString()
  milestone: string;
}
