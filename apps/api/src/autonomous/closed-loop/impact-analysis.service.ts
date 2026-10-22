import { Injectable, Logger } from '@nestjs/common';
import { AttributionMethod } from './outcome-measurement.service';

export interface BaselineContext {
  metricName: string;
  baselineValue: number;
  timeWindow: string;
  region: string;
  category?: string;
  historicalMean: number;
  forecastExpectation: number;
}

export interface ImpactAnalysisResult {
  interventionId: string;
  metricName: string;
  baselineValue: number;
  treatmentValue: number;
  controlValue?: number;
  absoluteDelta: number;
  incrementalLiftPct: number;
  attributionMethod: AttributionMethod;
  confidenceInterval: [number, number];
  isStatisticallySignificant: boolean;
  analyzedAt: Date;
}

@Injectable()
export class ImpactAnalysisService {
  private readonly logger = new Logger(ImpactAnalysisService.name);

  compareAgainstBaseline(
    interventionId: string,
    baseline: BaselineContext,
    treatmentValue: number,
    controlValue?: number,
  ): ImpactAnalysisResult {
    const reference = controlValue !== undefined ? controlValue : baseline.baselineValue;
    const absoluteDelta = Number((treatmentValue - reference).toFixed(2));
    const incrementalLiftPct = reference !== 0 ? Number(((absoluteDelta / reference) * 100).toFixed(2)) : 0;

    // Standard 95% Confidence Interval calculation approximation
    const standardError = Math.abs(reference) * 0.03;
    const marginOfError = 1.96 * standardError;
    const confidenceInterval: [number, number] = [
      Number((absoluteDelta - marginOfError).toFixed(2)),
      Number((absoluteDelta + marginOfError).toFixed(2)),
    ];

    const isStatisticallySignificant = confidenceInterval[0] > 0 || confidenceInterval[1] < 0;

    const result: ImpactAnalysisResult = {
      interventionId,
      metricName: baseline.metricName,
      baselineValue: baseline.baselineValue,
      treatmentValue,
      controlValue,
      absoluteDelta,
      incrementalLiftPct,
      attributionMethod: controlValue !== undefined ? 'ATTRIBUTED' : 'ESTIMATED',
      confidenceInterval,
      isStatisticallySignificant,
      analyzedAt: new Date(),
    };

    this.logger.log(
      `Impact analysis for ${interventionId} (${baseline.metricName}): Lift=${incrementalLiftPct}%, Sig=${isStatisticallySignificant}`,
    );

    return result;
  }
}
