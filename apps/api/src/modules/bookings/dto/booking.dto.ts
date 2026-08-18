import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;
}
