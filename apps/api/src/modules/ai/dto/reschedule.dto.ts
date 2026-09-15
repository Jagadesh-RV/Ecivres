import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RescheduleBookingDto {
  @ApiProperty({ description: 'Target Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ description: 'Reason for rescheduling' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: 'List of preferred alternative days' })
  @IsArray()
  preferredDays: string[];
}
