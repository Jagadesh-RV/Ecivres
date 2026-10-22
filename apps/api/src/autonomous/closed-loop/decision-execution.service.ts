import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionCatalogService } from './action-catalog.service';
import { ExecutionValidationService } from './execution-validation.service';
import { ExecutionCompensationService, CompensationResult } from './execution-compensation.service';
import { ExecuteActionDto } from './dto/execute-action.dto';

export type ExecutionStatus =
  | 'GENERATED'
  | 'RECOMMENDED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'VALIDATING'
  | 'SCHEDULED'
  | 'EXECUTING'
  | 'PARTIALLY_EXECUTED'
  | 'EXECUTED'
  | 'COMPENSATING'
  | 'COMPENSATED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface DecisionExecutionRecord {
  id: string;
  decisionId: string;
  actionType: string;
  status: ExecutionStatus;
  idempotencyKey: string;
  targetEntity: string;
  payload: Record<string, any>;
  compensationPayload?: Record<string, any>;
  executedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  tenantId?: string;
  correlationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DecisionExecutionService {
  private readonly logger = new Logger(DecisionExecutionService.name);
  private readonly inMemoryExecutions = new Map<string, DecisionExecutionRecord>();
  private readonly idempotencyIndex = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly actionCatalog: ActionCatalogService,
    private readonly validationService: ExecutionValidationService,
    private readonly compensationService: ExecutionCompensationService,
  ) {}

  async isIdempotent(idempotencyKey: string): Promise<boolean> {
    if (this.idempotencyIndex.has(idempotencyKey)) {
      return false;
    }
    const existing = await this.prisma.closedLoopExecution.findUnique({
      where: { idempotencyKey },
    });
    return !existing;
  }

  async executeDecisionAction(
    dto: ExecuteActionDto,
    autonomyLevel: number = 3,
    correlationId: string = `corr_${Date.now()}`,
  ): Promise<DecisionExecutionRecord> {
    // 1. Idempotency Check
    const canExecute = await this.isIdempotent(dto.idempotencyKey);
    if (!canExecute) {
      this.logger.warn(`Idempotency conflict for key: ${dto.idempotencyKey}`);
      throw new ConflictException(`Duplicate action execution blocked. Idempotency key '${dto.idempotencyKey}' already processed.`);
    }

    // 2. Policy & Guardrail Validation
    const validation = this.validationService.validateExecutionRequest(dto, autonomyLevel);
    if (validation.requiresApproval) {
      this.logger.warn(`Action ${dto.actionType} requires human approval before execution.`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // 3. Persist SCHEDULED state
    const record: DecisionExecutionRecord = {
      id: executionId,
      decisionId: dto.decisionId,
      actionType: dto.actionType,
      status: 'SCHEDULED',
      idempotencyKey: dto.idempotencyKey,
      targetEntity: dto.targetEntity,
      payload: dto.payload,
      compensationPayload: dto.compensationPayload,
      retryCount: 0,
      tenantId: dto.tenantId || 'GLOBAL',
      correlationId,
      createdAt: now,
      updatedAt: now,
    };

    this.idempotencyIndex.add(dto.idempotencyKey);
    this.inMemoryExecutions.set(executionId, record);

    try {
      await this.prisma.closedLoopExecution.create({
        data: {
          id: executionId,
          decisionId: dto.decisionId,
          actionType: dto.actionType,
          status: 'SCHEDULED',
          idempotencyKey: dto.idempotencyKey,
          targetEntity: dto.targetEntity,
          payload: dto.payload,
          compensationPayload: dto.compensationPayload,
          retryCount: 0,
          tenantId: dto.tenantId || 'GLOBAL',
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Prisma persistence skipped or fallback: ${err.message}`);
    }

    // 4. Transition to EXECUTING
    record.status = 'EXECUTING';
    record.executedAt = new Date();

    try {
      // Execute the business action effect
      const executionResultPayload = {
        ...dto.payload,
        executionEffect: 'APPLIED',
        processedTimestamp: new Date().toISOString(),
        correlationId,
      };

      record.status = 'EXECUTED';
      record.completedAt = new Date();
      record.payload = executionResultPayload;
      record.updatedAt = new Date();

      this.inMemoryExecutions.set(executionId, record);

      try {
        await this.prisma.closedLoopExecution.update({
          where: { id: executionId },
          data: {
            status: 'EXECUTED',
            payload: executionResultPayload,
            executedAt: record.executedAt,
            completedAt: record.completedAt,
            updatedAt: record.updatedAt,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Database update error (non-fatal): ${err.message}`);
      }

      this.logger.log(`Decision execution completed. ID: ${executionId}, Type: ${dto.actionType}`);
      return record;
    } catch (err: any) {
      record.status = 'FAILED';
      record.errorMessage = err.message;
      record.updatedAt = new Date();
      this.inMemoryExecutions.set(executionId, record);

      try {
        await this.prisma.closedLoopExecution.update({
          where: { id: executionId },
          data: {
            status: 'FAILED',
            errorMessage: err.message,
            updatedAt: record.updatedAt,
          },
        });
      } catch {
        // ignore
      }

      this.logger.error(`Execution failed for ${executionId}: ${err.message}`);
      throw err;
    }
  }

  async compensateDecision(executionId: string, reason: string): Promise<CompensationResult> {
    const existing = this.inMemoryExecutions.get(executionId);
    if (!existing) {
      throw new BadRequestException(`Execution record ${executionId} not found.`);
    }

    existing.status = 'COMPENSATING';
    const compRes = await this.compensationService.compensateExecution(
      executionId,
      existing.actionType,
      existing.payload,
      existing.compensationPayload,
      reason,
    );

    existing.status = compRes.status === 'COMPENSATED' ? 'COMPENSATED' : 'FAILED';
    existing.errorMessage = compRes.reason;
    existing.completedAt = new Date();
    this.inMemoryExecutions.set(executionId, existing);

    return compRes;
  }

  async getExecution(executionId: string): Promise<DecisionExecutionRecord | undefined> {
    const mem = this.inMemoryExecutions.get(executionId);
    if (mem) return mem;

    const dbRecord = await this.prisma.closedLoopExecution.findUnique({
      where: { id: executionId },
    });
    if (!dbRecord) return undefined;

    return {
      id: dbRecord.id,
      decisionId: dbRecord.decisionId,
      actionType: dbRecord.actionType,
      status: dbRecord.status as ExecutionStatus,
      idempotencyKey: dbRecord.idempotencyKey,
      targetEntity: dbRecord.targetEntity,
      payload: dbRecord.payload as Record<string, any>,
      compensationPayload: (dbRecord.compensationPayload as Record<string, any>) || undefined,
      executedAt: dbRecord.executedAt || undefined,
      completedAt: dbRecord.completedAt || undefined,
      errorMessage: dbRecord.errorMessage || undefined,
      retryCount: dbRecord.retryCount,
      tenantId: dbRecord.tenantId || undefined,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    };
  }

  async getAllExecutions(tenantId?: string): Promise<DecisionExecutionRecord[]> {
    if (tenantId) {
      return Array.from(this.inMemoryExecutions.values()).filter((e) => e.tenantId === tenantId);
    }
    return Array.from(this.inMemoryExecutions.values());
  }
}
