import { Injectable, Logger } from '@nestjs/common';
import { ProviderTelemetryDto } from './dto/telemetry.dto';

export interface TelemetryReport {
  providerId: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  speedKmh: number;
  batteryLevel?: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
}

@Injectable()
export class FleetTelemetryService {
  private readonly logger = new Logger(FleetTelemetryService.name);

  async processTelemetry(dto: ProviderTelemetryDto): Promise<TelemetryReport> {
    let anomalyDetected = false;
    let anomalyReason: string | undefined;

    if (dto.speedKmh > 160) {
      anomalyDetected = true;
      anomalyReason = 'Speed exceeds safety threshold (160 km/h)';
    } else if (dto.batteryLevel !== undefined && dto.batteryLevel < 10) {
      anomalyDetected = true;
      anomalyReason = 'Low battery warning (<10%)';
    }

    if (anomalyDetected) {
      this.logger.warn(`Telemetry anomaly for provider ${dto.providerId}: ${anomalyReason}`);
    }

    return {
      providerId: dto.providerId,
      timestamp: new Date().toISOString(),
      coordinates: { lat: dto.latitude, lng: dto.longitude },
      speedKmh: dto.speedKmh,
      batteryLevel: dto.batteryLevel,
      anomalyDetected,
      anomalyReason,
    };
  }
}
