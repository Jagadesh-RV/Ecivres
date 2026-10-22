import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type AttributionMethod = 'OBSERVED' | 'PREDICTED' | 'SIMULATED' | 'ESTIMATED' | 'ATTRIBUTED';

export interface RecordOutcomeDto {
  decisionId: string;
  executionId: string;
  metricName: string;
  expectedValue: number;
  actualValue: number;
  measurementWindow?: '1h' | '24h' | '7d';
  attributionMethod?: AttributionMethod;
  dataSource?: string;
  confidenceScore?: number;
}

export interface OutcomeMeasurementResult {
  id: string;
  decisionId: string;
  executionId: string;
  metricName: string;
  expectedValue: number;
  actualValue: number;
  deltaValue: number;
  deltaPercentage: number;
  measurementWindow: string;
  attributionMethod: AttributionMethod;
  confidenceScore: number;
  measuredAt: Date;
}

@Injectable()
export class OutcomeMeasurementService {
  private readonly logger = new Logger(OutcomeMeasurementService.name);
  private readonly inMemoryOutcomes = new Map<string, OutcomeMeasurementResult>();

  constructor(private readonly prisma: PrismaService) {}

  async measureOutcome(dto: RecordOutcomeDto): Promise<OutcomeMeasurementResult> {
    const deltaValue = Number((dto.actualValue - dto.expectedValue).toFixed(2));
    const deltaPercentage =
      dto.expectedValue !== 0
        ? Number((((dto.actualValue - dto.expectedValue) / Math.abs(dto.expectedValue)) * 100).toFixed(2))
        : 0;

    const outcomeId = `out_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const record: OutcomeMeasurementResult = {
      id: outcomeId,
      decisionId: dto.decisionId,
      executionId: dto.executionId,
      metricName: dto.metricName,
      expectedValue: dto.expectedValue,
      actualValue: dto.actualValue,
      deltaValue,
      deltaPercentage,
      measurementWindow: dto.measurementWindow || '24h',
      attributionMethod: dto.attributionMethod || 'OBSERVED',
      confidenceScore: dto.confidenceScore !== undefined ? dto.confidenceScore : 0.95,
      measuredAt: now,
    };

    this.inMemoryOutcomes.set(outcomeId, record);

    try {
      await this.prisma.decisionOutcomeRecord.create({
        data: {
          id: outcomeId,
          decisionId: dto.decisionId,
          executionId: dto.executionId,
          metricName: dto.metricName,
          expectedValue: dto.expectedValue,
          actualValue: dto.actualValue,
          deltaValue,
          deltaPercentage,
          measurementWindow: record.measurementWindow,
          confidenceScore: record.confidenceScore,
          measuredAt: now,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed persisting outcome to database (in-memory preserved): ${err.message}`);
    }

    this.logger.log(
      `Measured outcome ${outcomeId} for metric ${dto.metricName}: Expected=${dto.expectedValue}, Actual=${dto.actualValue}, Delta=${deltaPercentage}%`,
    );

    return record;
  }

  async getOutcomesByDecision(decisionId: string): Promise<OutcomeMeasurementResult[]> {
    const list = Array.from(this.inMemoryOutcomes.values()).filter((o) => o.decisionId === decisionId);
    if (list.length > 0) return list;

    try {
      const records = await this.prisma.decisionOutcomeRecord.findMany({
        where: { decisionId },
      });
      return records.map((r: any) => ({
        id: r.id,
        decisionId: r.decisionId,
        executionId: r.executionId,
        metricName: r.metricName,
        expectedValue: r.expectedValue,
        actualValue: r.actualValue,
        deltaValue: r.deltaValue,
        deltaPercentage: r.deltaPercentage,
        measurementWindow: r.measurementWindow,
        attributionMethod: 'OBSERVED',
        confidenceScore: r.confidenceScore,
        measuredAt: r.measuredAt,
      }));
    } catch {
      return [];
    }
  }
}
