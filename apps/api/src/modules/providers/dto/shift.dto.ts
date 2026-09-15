import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty({ description: 'Staff ID' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ description: 'Shift start timestamp ISO string' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Shift end timestamp ISO string' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'Assigned service zone' })
  @IsString()
  @IsNotEmpty()
  zone: string;
}
