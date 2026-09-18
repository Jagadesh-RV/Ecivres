import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum DeviceType {
  HVAC_SENSOR = 'HVAC_SENSOR',
  SMART_WATER_METER = 'SMART_WATER_METER',
  SOLAR_INVERTER = 'SOLAR_INVERTER',
  SECURITY_GATEWAY = 'SECURITY_GATEWAY',
  APPLIANCE_MONITOR = 'APPLIANCE_MONITOR',
}

export class RegisterDeviceDto {
  @IsString()
  deviceMacAddress!: string;

  @IsString()
  deviceName!: string;

  @IsEnum(DeviceType)
  deviceType!: DeviceType;

  @IsString()
  ownerId!: string;

  @IsOptional()
  @IsString()
  firmwareVersion?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
