import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ChurnAnalysisDto {
  @IsString()
  customerId!: string;

  @IsNumber()
  @Min(0)
  daysSinceLastBooking!: number;

  @IsNumber()
  @Min(0)
  totalHistoricalBookings!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  averageRatingGiven?: number;
}
