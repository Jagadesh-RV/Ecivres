import { Injectable, Logger } from '@nestjs/common';
import { DeviceTelemetryDto } from './dto/device-telemetry.dto';

export interface MqttIngestResult {
  messageId: string;
  deviceId: string;
  topic: string;
  processedAt: string;
  status: 'ACCEPTED' | 'DROPPED';
}

@Injectable()
export class MqttGatewayService {
  private readonly logger = new Logger(MqttGatewayService.name);

  async handleIncomingTelemetry(topic: string, payload: DeviceTelemetryDto): Promise<MqttIngestResult> {
    const messageId = `mqtt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.logger.log(`Received MQTT telemetry topic=${topic} deviceId=${payload.deviceId}`);

    return {
      messageId,
      deviceId: payload.deviceId,
      topic,
      processedAt: new Date().toISOString(),
      status: 'ACCEPTED',
    };
  }
}
