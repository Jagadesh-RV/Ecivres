import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type ExperimentStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'RUNNING'
  | 'PAUSED'
  | 'STOPPING'
  | 'COMPLETED'
  | 'TERMINATED'
  | 'FAILED';

export interface CreateExperimentDto {
  name: string;
  description: string;
  hypothesis: string;
  objectiveMetric: string;
  controlVariant: Record<string, any>;
  testVariants: Record<string, any>[];
  trafficSplit: Record<string, number>; // e.g. { control: 50, variantA: 50 }
  errorGuardrailThreshold?: number; // default 0.05 (5%)
  maxAllowedConversionDropPct?: number; // default 15%
}

export interface ExperimentRecordModel {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  controlVariant: Record<string, any>;
  testVariants: Record<string, any>[];
  trafficSplit: Record<string, number>;
  targetMetrics: Record<string, any>;
  errorGuardrailThreshold: number;
  winningVariant?: string;
  terminationReason?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ExperimentationService {
  private readonly logger = new Logger(ExperimentationService.name);
  private readonly experiments = new Map<string, ExperimentRecordModel>();

  constructor(private readonly prisma: PrismaService) {}

  async createExperiment(dto: CreateExperimentDto): Promise<ExperimentRecordModel> {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();

    const record: ExperimentRecordModel = {
      id,
      name: dto.name,
      description: dto.description,
      status: 'DRAFT',
      controlVariant: dto.controlVariant,
      testVariants: dto.testVariants,
      trafficSplit: dto.trafficSplit,
      targetMetrics: {
        objective: dto.objectiveMetric,
        hypothesis: dto.hypothesis,
        maxAllowedConversionDropPct: dto.maxAllowedConversionDropPct || 15.0,
      },
      errorGuardrailThreshold: dto.errorGuardrailThreshold || 0.05,
      createdAt: now,
      updatedAt: now,
    };

    this.experiments.set(id, record);

    try {
      await this.prisma.experimentationRecord.create({
        data: {
          id,
          name: dto.name,
          description: dto.description,
          status: 'DRAFT',
          controlVariant: dto.controlVariant,
          testVariants: dto.testVariants,
          trafficSplit: dto.trafficSplit,
          targetMetrics: record.targetMetrics,
          errorGuardrailThreshold: record.errorGuardrailThreshold,
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed persisting experiment to database: ${err.message}`);
    }

    this.logger.log(`Created experiment '${dto.name}' (ID: ${id}) in DRAFT state.`);
    return record;
  }

  async launchExperiment(id: string): Promise<ExperimentRecordModel> {
    const exp = this.experiments.get(id);
    if (!exp) {
      throw new BadRequestException(`Experiment ${id} not found.`);
    }

    exp.status = 'RUNNING';
    exp.startedAt = new Date();
    exp.updatedAt = new Date();
    this.experiments.set(id, exp);

    try {
      await this.prisma.experimentationRecord.update({
        where: { id },
        data: { status: 'RUNNING', startedAt: exp.startedAt, updatedAt: exp.updatedAt },
      });
    } catch {
      // ignore
    }

    this.logger.log(`Launched experiment ${id}: status=RUNNING.`);
    return exp;
  }

  /**
   * Evaluates guardrail health for running experiments.
   * AUTOMATICALLY TERMINATES experiment if error threshold or safety limits breached.
   */
  async evaluateGuardrails(
    id: string,
    telemetry: { currentErrorRate: number; conversionDropPct: number; fraudIndicatorCount: number },
  ): Promise<{ healthy: boolean; status: ExperimentStatus; reason?: string }> {
    const exp = this.experiments.get(id);
    if (!exp) {
      throw new BadRequestException(`Experiment ${id} not found.`);
    }

    if (exp.status !== 'RUNNING') {
      return { healthy: true, status: exp.status };
    }

    // 1. Error rate check
    if (telemetry.currentErrorRate > exp.errorGuardrailThreshold) {
      const reason = `Error rate ${(telemetry.currentErrorRate * 100).toFixed(1)}% exceeded threshold ${(exp.errorGuardrailThreshold * 100).toFixed(1)}%`;
      return this.terminateExperiment(id, reason);
    }

    // 2. Conversion drop check
    const maxDrop = (exp.targetMetrics as any)?.maxAllowedConversionDropPct || 15.0;
    if (telemetry.conversionDropPct > maxDrop) {
      const reason = `Severe conversion collapse: -${telemetry.conversionDropPct}% exceeded max allowed drop of -${maxDrop}%`;
      return this.terminateExperiment(id, reason);
    }

    // 3. Fraud spike check
    if (telemetry.fraudIndicatorCount > 10) {
      const reason = `Fraud indicator spike detected: ${telemetry.fraudIndicatorCount} suspicious events recorded.`;
      return this.terminateExperiment(id, reason);
    }

    return { healthy: true, status: 'RUNNING' };
  }

  async terminateExperiment(id: string, reason: string): Promise<{ healthy: boolean; status: ExperimentStatus; reason: string }> {
    const exp = this.experiments.get(id);
    if (exp) {
      exp.status = 'TERMINATED';
      exp.terminationReason = reason;
      exp.endedAt = new Date();
      exp.updatedAt = new Date();
      this.experiments.set(id, exp);

      try {
        await this.prisma.experimentationRecord.update({
          where: { id },
          data: { status: 'TERMINATED', endedAt: exp.endedAt, updatedAt: exp.updatedAt },
        });
      } catch {
        // ignore
      }
    }

    this.logger.error(`EMERGENCY TERMINATION of experiment ${id}: ${reason}`);
    return { healthy: false, status: 'TERMINATED', reason };
  }

  async completeExperiment(id: string, winningVariant: string): Promise<ExperimentRecordModel> {
    const exp = this.experiments.get(id);
    if (!exp) throw new BadRequestException(`Experiment ${id} not found.`);

    exp.status = 'COMPLETED';
    exp.winningVariant = winningVariant;
    exp.endedAt = new Date();
    exp.updatedAt = new Date();
    this.experiments.set(id, exp);

    try {
      await this.prisma.experimentationRecord.update({
        where: { id },
        data: { status: 'COMPLETED', winningVariant, endedAt: exp.endedAt, updatedAt: exp.updatedAt },
      });
    } catch {
      // ignore
    }

    this.logger.log(`Concluded experiment ${id}. Winning variant: ${winningVariant}`);
    return exp;
  }

  getExperiment(id: string): ExperimentRecordModel | undefined {
    return this.experiments.get(id);
  }

  getAllExperiments(): ExperimentRecordModel[] {
    return Array.from(this.experiments.values());
  }
}
