import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecordIntelligenceSignalDto } from '../dto/intelligence.dto';

export interface ImbalanceDetectionResult {
  regionCode: string;
  liquidityRatio: number;
  marketState: 'SEVERE_DEFICIT' | 'HEALTHY' | 'OVERSUPPLIED';
  recommendation?: string;
  confidence: number;
  evaluatedAt: Date;
}

export interface SurgeAnomalyResult {
  regionCode: string;
  requestedMultiplier: number;
  baselineMultiplier: number;
  isAnomaly: boolean;
  anomalyScore: number;
  recommendation: 'APPROVE' | 'CAP_TO_SAFE_CEILING' | 'REJECT';
  cappedMultiplier?: number;
}

@Injectable()
export class EcosystemIntelligenceService {
  private readonly logger = new Logger(EcosystemIntelligenceService.name);
  private readonly inMemorySignals: Array<RecordIntelligenceSignalDto & { id: string; recordedAt: Date }> = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records an explicit intelligence signal with provenance classification.
   */
  async recordSignal(dto: RecordIntelligenceSignalDto): Promise<string> {
    const id = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    this.inMemorySignals.push({
      id,
      ...dto,
      recordedAt: now,
    });

    try {
      await this.prisma.ecosystemIntelligenceSignal.create({
        data: {
          id,
          regionCode: dto.regionCode.toUpperCase(),
          metricType: dto.metricType,
          signalType: dto.signalType,
          observedValue: dto.observedValue,
          baselineValue: dto.baselineValue,
          confidence: dto.confidence ?? 0.95,
          evidenceJson: dto.evidenceJson,
          recordedAt: now,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist intelligence signal: ${err.message}`);
    }

    this.logger.log(`Recorded signal [${dto.signalType}] ${dto.metricType}=${dto.observedValue} for ${dto.regionCode}`);
    return id;
  }

  /**
   * Evaluates regional supply-demand imbalance and outputs categorized guidance.
   */
  async detectSupplyDemandImbalance(
    regionCode: string,
    availableProviders: number,
    pendingBookingRequests: number,
  ): Promise<ImbalanceDetectionResult> {
    const safeRequests = Math.max(1, pendingBookingRequests);
    const liquidityRatio = Math.round((availableProviders / safeRequests) * 100) / 100;

    let marketState: 'SEVERE_DEFICIT' | 'HEALTHY' | 'OVERSUPPLIED';
    let recommendation: string | undefined;

    if (liquidityRatio < 0.6) {
      marketState = 'SEVERE_DEFICIT';
      recommendation = `High demand surge in ${regionCode}: Recommend 15% provider incentive boost and localized surge pricing.`;
    } else if (liquidityRatio > 3.0) {
      marketState = 'OVERSUPPLIED';
      recommendation = `Oversupply detected in ${regionCode}: Recommend targeted customer acquisition promotions.`;
    } else {
      marketState = 'HEALTHY';
    }

    const confidence = availableProviders + pendingBookingRequests >= 20 ? 0.95 : 0.65;

    await this.recordSignal({
      regionCode,
      metricType: 'SUPPLY_IMBALANCE',
      signalType: 'STATISTICAL_ESTIMATE',
      observedValue: liquidityRatio,
      baselineValue: 1.5,
      confidence,
      evidenceJson: { availableProviders, pendingBookingRequests, marketState },
    });

    return {
      regionCode: regionCode.toUpperCase(),
      liquidityRatio,
      marketState,
      recommendation,
      confidence,
      evaluatedAt: new Date(),
    };
  }

  /**
   * Inspects pricing surge requests and flags price-gouging anomalies or sudden spikes.
   */
  async detectPricingSurgeAnomaly(
    regionCode: string,
    requestedMultiplier: number,
    baselineMultiplier: number = 1.0,
    maxPermittedMultiplier: number = 2.0,
  ): Promise<SurgeAnomalyResult> {
    const deviation = requestedMultiplier - baselineMultiplier;
    const isAnomaly = requestedMultiplier > maxPermittedMultiplier || deviation > 1.2;
    const anomalyScore = Math.min(1.0, Math.max(0.0, deviation / 1.5));

    let recommendation: 'APPROVE' | 'CAP_TO_SAFE_CEILING' | 'REJECT';
    let cappedMultiplier: number | undefined;

    if (requestedMultiplier > maxPermittedMultiplier) {
      recommendation = 'CAP_TO_SAFE_CEILING';
      cappedMultiplier = maxPermittedMultiplier;
    } else if (isAnomaly) {
      recommendation = 'REJECT';
    } else {
      recommendation = 'APPROVE';
      cappedMultiplier = requestedMultiplier;
    }

    await this.recordSignal({
      regionCode,
      metricType: 'DEMAND_SURGE',
      signalType: 'RECOMMENDATION',
      observedValue: requestedMultiplier,
      baselineValue: baselineMultiplier,
      confidence: 0.92,
      evidenceJson: { isAnomaly, anomalyScore, recommendation, cappedMultiplier },
    });

    return {
      regionCode: regionCode.toUpperCase(),
      requestedMultiplier,
      baselineMultiplier,
      isAnomaly,
      anomalyScore: Math.round(anomalyScore * 100) / 100,
      recommendation,
      cappedMultiplier,
    };
  }
}
