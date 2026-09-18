import { Module } from '@nestjs/common';
import { MqttGatewayService } from './mqtt-gateway.service';
import { DeviceHealthService } from './device-health.service';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';
import { AutoBookingDispatchService } from './auto-booking-dispatch.service';
import { IotController } from './iot.controller';

@Module({
  controllers: [IotController],
  providers: [
    MqttGatewayService,
    DeviceHealthService,
    PredictiveMaintenanceService,
    AutoBookingDispatchService,
  ],
  exports: [
    MqttGatewayService,
    DeviceHealthService,
    PredictiveMaintenanceService,
    AutoBookingDispatchService,
  ],
})
export class IotModule {}
