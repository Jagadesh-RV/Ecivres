import { Injectable, Logger } from '@nestjs/common';
import { DeviceTelemetryDto } from './dto/device-telemetry.dto';

export interface AnomalyEvaluationResult {
  deviceId: string;
  isAnomalyDetected: boolean;
  anomalyScore: number; // 0 to 100
  recommendedAction?: string;
  urgentLevel: 'NONE' | 'LOW' | 'HIGH' | 'CRITICAL';
}

@Injectable()
export class PredictiveMaintenanceService {
  private readonly logger = new Logger(PredictiveMaintenanceService.name);

  async evaluateTelemetry(telemetry: DeviceTelemetryDto): Promise<AnomalyEvaluationResult> {
    let score = 0;
    const reasons: string[] = [];

    if (telemetry.temperatureCelsius && telemetry.temperatureCelsius > 85) {
      score += 50;
      reasons.push('High temperature reading (>85°C)');
    }

    if (telemetry.vibrationHz && telemetry.vibrationHz > 120) {
      score += 40;
      reasons.push('Excessive motor vibration (>120 Hz)');
    }

    let urgentLevel: 'NONE' | 'LOW' | 'HIGH' | 'CRITICAL' = 'NONE';
    let recommendedAction: string | undefined;

    if (score >= 70) {
      urgentLevel = 'CRITICAL';
      recommendedAction = 'Dispatch emergency technician for immediate inspection';
    } else if (score >= 40) {
      urgentLevel = 'HIGH';
      recommendedAction = 'Schedule preventive maintenance within 48 hours';
    } else if (score > 0) {
      urgentLevel = 'LOW';
      recommendedAction = 'Log sensor anomaly for routine inspection';
    }

    return {
      deviceId: telemetry.deviceId,
      isAnomalyDetected: score > 0,
      anomalyScore: score,
      recommendedAction,
      urgentLevel,
    };
  }
}
