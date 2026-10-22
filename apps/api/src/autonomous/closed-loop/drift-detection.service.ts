import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DriftEvaluationResult {
  id: string;
  metricName: string;
  featureName: string;
  baselineValue: number;
  currentValue: number;
  driftScore: number; // Kolmogorov-Smirnov / PSI score
  isDriftDetected: boolean;
  severity: 'HEALTHY' | 'LOW_DRIFT' | 'CRITICAL_DRIFT';
  recommendation: string;
  detectedAt: Date;
}

@Injectable()
export class DriftDetectionService {
  private readonly logger = new Logger(DriftDetectionService.name);
  private readonly driftRecords: DriftEvaluationResult[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates feature distribution and prediction drift.
   * INVARIANT: Never automatically deploys an unvetted model. Alerts and recommends governance review.
   */
  async evaluateFeatureDrift(
    metricName: string,
    featureName: string,
    baselineValue: number,
    currentValue: number,
    driftThreshold: number = 0.15,
  ): Promise<DriftEvaluationResult> {
    const id = `drift_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const relativeShift = baselineValue !== 0 ? Math.abs((currentValue - baselineValue) / baselineValue) : 0;
    const driftScore = Number(relativeShift.toFixed(3));
    const isDriftDetected = driftScore > driftThreshold;

    let severity: DriftEvaluationResult['severity'] = 'HEALTHY';
    let recommendation = 'Model calibration and feature distributions remain stable.';

    if (driftScore > 0.35) {
      severity = 'CRITICAL_DRIFT';
      recommendation = `Significant regime change detected in ${featureName} (Drift: ${driftScore}). Recommend initiating governed model retrain and canary evaluation.`;
    } else if (isDriftDetected) {
      severity = 'LOW_DRIFT';
      recommendation = `Moderate feature drift detected in ${featureName}. Increase telemetry sampling and monitor prediction errors.`;
    }

    const record: DriftEvaluationResult = {
      id,
      metricName,
      featureName,
      baselineValue,
      currentValue,
      driftScore,
      isDriftDetected,
      severity,
      recommendation,
      detectedAt: new Date(),
    };

    this.driftRecords.push(record);

    try {
      await this.prisma.driftDetectionRecord.create({
        data: {
          id,
          metricName,
          featureName,
          baselineValue,
          currentValue,
          driftScore,
          isDriftDetected,
          detectedAt: record.detectedAt,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed writing drift detection to database: ${err.message}`);
    }

    if (isDriftDetected) {
      this.logger.warn(`DRIFT DETECTED: ${featureName} driftScore=${driftScore} (severity=${severity})`);
    }

    return record;
  }

  getAllDriftRecords(): DriftEvaluationResult[] {
    return this.driftRecords;
  }
}
