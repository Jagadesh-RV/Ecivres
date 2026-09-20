import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettleEscrowDto {
  @ApiProperty({ description: 'Escrow ID', example: 'esc_smart_900' })
  @IsString()
  escrowId: string;

  @ApiProperty({ description: 'Gross Escrow Amount in USD', example: 1000.0 })
  @IsNumber()
  @Min(1)
  grossAmount: number;
}
