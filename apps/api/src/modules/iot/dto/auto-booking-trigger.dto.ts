import { IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export enum AlertMetric {
  TEMPERATURE_HIGH = 'TEMPERATURE_HIGH',
  PRESSURE_LOW = 'PRESSURE_LOW',
  VIBRATION_EXCESSIVE = 'VIBRATION_EXCESSIVE',
  HUMIDITY_HIGH = 'HUMIDITY_HIGH',
}

export class AutoBookingTriggerDto {
  @IsString()
  deviceId!: string;

  @IsEnum(AlertMetric)
  alertMetric!: AlertMetric;

  @IsNumber()
  thresholdValue!: number;

  @IsString()
  serviceCategoryId!: string;

  @IsBoolean()
  autoConfirm!: boolean;
}
