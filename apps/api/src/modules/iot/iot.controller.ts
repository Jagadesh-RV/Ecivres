import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DeviceTelemetryDto } from './dto/device-telemetry.dto';
import { AutoBookingTriggerDto } from './dto/auto-booking-trigger.dto';
import { MqttGatewayService } from './mqtt-gateway.service';
import { DeviceHealthService } from './device-health.service';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';
import { AutoBookingDispatchService } from './auto-booking-dispatch.service';

@Controller('iot')
export class IotController {
  constructor(
    private readonly mqttGateway: MqttGatewayService,
    private readonly deviceHealth: DeviceHealthService,
    private readonly predictiveMaintenance: PredictiveMaintenanceService,
    private readonly autoBookingDispatch: AutoBookingDispatchService,
  ) {}

  @Post('devices')
  registerDevice(@Body() dto: RegisterDeviceDto) {
    return {
      deviceId: `dev_${Date.now()}`,
      status: 'REGISTERED',
      ...dto,
    };
  }

  @Post('telemetry')
  ingestTelemetry(@Body() dto: DeviceTelemetryDto) {
    return this.mqttGateway.handleIncomingTelemetry('ecivres/telemetry/ingest', dto);
  }

  @Get('health/:deviceId')
  checkHealth(@Param('deviceId') deviceId: string, @Query('batteryPct') batteryPct?: string) {
    return this.deviceHealth.checkDeviceHealth(deviceId, 60000, batteryPct ? Number(batteryPct) : 85);
  }

  @Post('predict-maintenance')
  evaluateTelemetry(@Body() dto: DeviceTelemetryDto) {
    return this.predictiveMaintenance.evaluateTelemetry(dto);
  }

  @Post('trigger-auto-booking')
  triggerAutoBooking(@Body() dto: AutoBookingTriggerDto) {
    return this.autoBookingDispatch.processTrigger(dto);
  }
}
