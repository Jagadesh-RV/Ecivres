import { Injectable, Logger } from '@nestjs/common';
import { IntelligenceSignalCategory, ProvenanceRecordDto } from '../dto/intelligence.dto';

export interface DecisionEvidenceAudit {
  signalId: string;
  category: IntelligenceSignalCategory;
  sourceType: 'OBSERVED_EVENT' | 'STATISTICAL_AGGREGATION' | 'ML_FORECAST' | 'GUARDRAIL_POLICY';
  sampleSize: number;
  dataFreshnessSeconds: number;
  isSufficientData: boolean;
  businessRationale: string;
}

@Injectable()
export class DecisionProvenanceService {
  private readonly logger = new Logger(DecisionProvenanceService.name);
  private readonly MIN_SAMPLE_SIZE_FOR_ACTION = 15;
  private readonly MAX_DATA_STALENESS_SECONDS = 3600; // 1 hour

  /**
   * Evaluates whether available evidence is sufficient and reliable for an autonomous decision.
   */
  classifyEvidence(
    signalId: string,
    category: IntelligenceSignalCategory,
    sampleSize: number,
    dataFreshnessSeconds: number,
    businessContext: string,
  ): DecisionEvidenceAudit {
    const isFresh = dataFreshnessSeconds <= this.MAX_DATA_STALENESS_SECONDS;
    const hasSufficientVolume = sampleSize >= this.MIN_SAMPLE_SIZE_FOR_ACTION;
    const isSufficientData = isFresh && hasSufficientVolume;

    let sourceType: DecisionEvidenceAudit['sourceType'];
    switch (category) {
      case 'FACT':
      case 'EXECUTED_ACTION':
        sourceType = 'OBSERVED_EVENT';
        break;
      case 'STATISTICAL_ESTIMATE':
        sourceType = 'STATISTICAL_AGGREGATION';
        break;
      case 'PREDICTION':
        sourceType = 'ML_FORECAST';
        break;
      case 'RECOMMENDATION':
        sourceType = 'GUARDRAIL_POLICY';
        break;
    }

    const rationale = isSufficientData
      ? `Decision supported by ${sampleSize} verified data points (freshness: ${dataFreshnessSeconds}s). Context: ${businessContext}`
      : `INSUFFICIENT_DATA: Sample size ${sampleSize} (< ${this.MIN_SAMPLE_SIZE_FOR_ACTION}) or data staleness ${dataFreshnessSeconds}s exceeds threshold. Autonomous mutation suppressed.`;

    if (!isSufficientData) {
      this.logger.warn(`Evidence insufficient for signal ${signalId}: ${rationale}`);
    }

    return {
      signalId,
      category,
      sourceType,
      sampleSize,
      dataFreshnessSeconds,
      isSufficientData,
      businessRationale: rationale,
    };
  }

  /**
   * Sanitizes diagnostic metadata to ensure internal model prompts, weights, or tokens are never leaked.
   */
  sanitizeEvidencePayload(rawPayload: Record<string, any>): Record<string, any> {
    const sanitized = { ...rawPayload };
    const forbiddenKeys = ['prompt', 'internalPrompt', 'systemInstruction', 'modelWeights', 'tokenProbabilities', 'hiddenState'];

    for (const key of Object.keys(sanitized)) {
      if (forbiddenKeys.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
        delete sanitized[key];
      }
    }

    return sanitized;
  }
}
