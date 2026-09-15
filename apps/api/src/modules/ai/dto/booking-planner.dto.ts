import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingPlannerDto {
  @ApiProperty({ description: 'Customer User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Goal prompt for autonomous booking plan' })
  @IsString()
  @IsNotEmpty()
  goal: string;

  @ApiPropertyOptional({ description: 'Optional maximum budget limit' })
  @IsNumber()
  @IsOptional()
  budgetLimit?: number;

  @ApiPropertyOptional({ description: 'Preferred time window for execution' })
  @IsString()
  @IsOptional()
  preferredTimeWindow?: string;
}
