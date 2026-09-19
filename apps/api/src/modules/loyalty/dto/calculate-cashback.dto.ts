import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateCashbackDto {
  @ApiProperty({ description: 'User ID', example: 'usr_1001' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Transaction amount in USD', example: 150.0 })
  @IsNumber()
  @Min(0)
  amount: number;
}
