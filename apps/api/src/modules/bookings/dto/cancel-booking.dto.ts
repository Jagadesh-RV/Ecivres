import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiPropertyOptional({ description: 'Optional reason for booking cancellation' })
  @IsString()
  @IsOptional()
  reason?: string;
}
