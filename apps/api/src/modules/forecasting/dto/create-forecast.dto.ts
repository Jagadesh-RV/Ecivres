import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ForecastHorizon {
  ONE_HOUR = '1H',
  ONE_DAY = '1D',
  SEVEN_DAYS = '7D',
  THIRTY_DAYS = '30D',
}

export enum ForecastType {
  DEMAND = 'DEMAND',
  REVENUE = 'REVENUE',
  CAPACITY = 'CAPACITY',
  CHURN = 'CHURN',
}

export enum ForecastMethod {
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  TREND_FORECASTING = 'TREND_FORECASTING',
}

export class CreateForecastDto {
  @IsEnum(ForecastType)
  forecastType: ForecastType;

  @IsEnum(ForecastHorizon)
  targetHorizon: ForecastHorizon;

  @IsEnum(ForecastMethod)
  @IsOptional()
  method?: ForecastMethod = ForecastMethod.EXPONENTIAL_SMOOTHING;

  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';

  @IsString()
  @IsOptional()
  category?: string;
}
