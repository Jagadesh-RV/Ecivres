import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSmartDeviceDto {
  @ApiProperty({ description: 'Home Identifier', example: 'home_residence_99' })
  @IsString()
  homeId: string;

  @ApiProperty({ description: 'Device Type Category', example: 'SMART_HVAC' })
  @IsString()
  deviceType: string;

  @ApiProperty({ description: 'MQTT Telemetry Topic', example: 'ecivres/telemetry/home_99/hvac' })
  @IsString()
  telemetryTopic: string;
}
