import { Injectable, Logger } from '@nestjs/common';
import { AnomalySeverityDto } from '../dto/detect-anomaly.dto';

export interface TelemetrySample {
  metricName: string;
  currentValue: number;
  baselineMean: number;
  baselineStdDev: number;
  region?: string;
  category?: string;
}

export interface RuleEvaluationResult {
  isAnomaly: boolean;
  type: string;
  severity: AnomalySeverityDto;
  confidence: number;
  evidence: Record<string, any>;
  recommendedAction: string;
}

@Injectable()
export class AnomalyRuleService {
  private readonly logger = new Logger(AnomalyRuleService.name);

  evaluateTelemetry(sample: TelemetrySample): RuleEvaluationResult {
    const zScore = sample.baselineStdDev > 0 ? (sample.currentValue - sample.baselineMean) / sample.baselineStdDev : 0;
    const isSpike = zScore > 3.0;
    const isDrop = zScore < -3.0;

    if (!isSpike && !isDrop) {
      return {
        isAnomaly: false,
        type: sample.metricName,
        severity: AnomalySeverityDto.LOW,
        confidence: 0,
        evidence: { zScore, currentValue: sample.currentValue, baselineMean: sample.baselineMean },
        recommendedAction: 'NONE',
      };
    }

    const severity = Math.abs(zScore) > 5.0 ? AnomalySeverityDto.CRITICAL : AnomalySeverityDto.HIGH;
    const confidence = Math.min(1.0, 0.7 + Math.abs(zScore) * 0.05);
    const action = isSpike
      ? `Investigate surge in ${sample.metricName} (Z-Score ${zScore.toFixed(2)})`
      : `Investigate drop in ${sample.metricName} (Z-Score ${zScore.toFixed(2)})`;

    return {
      isAnomaly: true,
      type: `${sample.metricName}_${isSpike ? 'SPIKE' : 'DROP'}`,
      severity,
      confidence: Math.round(confidence * 100) / 100,
      evidence: { zScore, currentValue: sample.currentValue, baselineMean: sample.baselineMean, stdDev: sample.baselineStdDev },
      recommendedAction: action,
    };
  }
}
