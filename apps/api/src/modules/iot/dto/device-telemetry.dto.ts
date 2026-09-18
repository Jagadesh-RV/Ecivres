import { IsString, IsNumber, IsOptional, IsObject, Min, Max } from 'class-validator';

export class DeviceTelemetryDto {
  @IsString()
  deviceId!: string;

  @IsNumber()
  timestamp!: number;

  @IsOptional()
  @IsNumber()
  temperatureCelsius?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidityPercentage?: number;

  @IsOptional()
  @IsNumber()
  vibrationHz?: number;

  @IsOptional()
  @IsNumber()
  pressurePsi?: number;

  @IsOptional()
  @IsObject()
  rawReadings?: Record<string, number>;
}
