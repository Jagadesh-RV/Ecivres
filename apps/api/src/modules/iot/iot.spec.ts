import { Test, TestingModule } from '@nestjs/testing';
import { MqttGatewayService } from './mqtt-gateway.service';
import { DeviceHealthService } from './device-health.service';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';
import { AutoBookingDispatchService } from './auto-booking-dispatch.service';

import { AlertMetric } from './dto/auto-booking-trigger.dto';

describe('IoT Module Services', () => {
  let mqttGateway: MqttGatewayService;
  let deviceHealth: DeviceHealthService;
  let predictiveMaintenance: PredictiveMaintenanceService;
  let autoBookingDispatch: AutoBookingDispatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MqttGatewayService,
        DeviceHealthService,
        PredictiveMaintenanceService,
        AutoBookingDispatchService,
      ],
    }).compile();

    mqttGateway = module.get<MqttGatewayService>(MqttGatewayService);
    deviceHealth = module.get<DeviceHealthService>(DeviceHealthService);
    predictiveMaintenance = module.get<PredictiveMaintenanceService>(PredictiveMaintenanceService);
    autoBookingDispatch = module.get<AutoBookingDispatchService>(AutoBookingDispatchService);
  });

  it('should accept incoming MQTT telemetry topic payload', async () => {
    const res = await mqttGateway.handleIncomingTelemetry('ecivres/sensors/temp', {
      deviceId: 'dev_100',
      timestamp: Date.now(),
      temperatureCelsius: 90,
    });
    expect(res.status).toBe('ACCEPTED');
    expect(res.deviceId).toBe('dev_100');
  });

  it('should evaluate critical maintenance alert when temperature exceeds 85C', async () => {
    const res = await predictiveMaintenance.evaluateTelemetry({
      deviceId: 'dev_hvac_1',
      timestamp: Date.now(),
      temperatureCelsius: 95,
      vibrationHz: 130,
    });
    expect(res.isAnomalyDetected).toBe(true);
    expect(res.urgentLevel).toBe('CRITICAL');
  });

  it('should trigger automated booking dispatch', async () => {
    const res = await autoBookingDispatch.processTrigger({
      deviceId: 'dev_100',
      alertMetric: AlertMetric.TEMPERATURE_HIGH,
      thresholdValue: 90,
      serviceCategoryId: 'cat_hvac',
      autoConfirm: true,
    });
    expect(res.status).toBe('DISPATCHED');
    expect(res.generatedBookingId).toBeDefined();
  });
});
