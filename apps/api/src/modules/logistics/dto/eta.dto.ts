import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecalculateEtaDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'Current provider latitude' })
  @IsNumber()
  currentLat: number;

  @ApiProperty({ description: 'Current provider longitude' })
  @IsNumber()
  currentLng: number;

  @ApiProperty({ description: 'Target destination latitude' })
  @IsNumber()
  targetLat: number;

  @ApiProperty({ description: 'Target destination longitude' })
  @IsNumber()
  targetLng: number;
}
