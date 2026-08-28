import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  comment?: string;
}
