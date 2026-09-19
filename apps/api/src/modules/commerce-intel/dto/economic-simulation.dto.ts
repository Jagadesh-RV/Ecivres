import { IsString, IsNumber, Min, Max } from 'class-validator';

export class SimulateRevenueDto {
  @IsString()
  category!: string;

  @IsNumber()
  @Min(100)
  currentMonthlyBookings!: number;

  @IsNumber()
  @Min(1)
  averageTicketSizeUsd!: number;

  @IsNumber()
  @Min(-50)
  @Max(200)
  projectedGrowthRatePercentage!: number;
}
