import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { ExecuteActionDto } from './dto/execute-action.dto';

export interface ActionExecutionResult {
  executionId: string;
  decisionId: string;
  actionType: string;
  status: 'SCHEDULED' | 'EXECUTING' | 'EXECUTED' | 'FAILED' | 'COMPENSATED';
  idempotencyKey: string;
  targetEntity: string;
  resultPayload: Record<string, any>;
  executedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

@Injectable()
export class ActionExecutorService {
  private readonly logger = new Logger(ActionExecutorService.name);
  private readonly processedKeys = new Set<string>();
  private readonly executions = new Map<string, ActionExecutionResult>();

  async checkIdempotency(idempotencyKey: string): Promise<boolean> {
    return this.processedKeys.has(idempotencyKey);
  }

  async executeAction(dto: ExecuteActionDto): Promise<ActionExecutionResult> {
    if (await this.checkIdempotency(dto.idempotencyKey)) {
      this.logger.warn(`Duplicate action execution blocked for idempotency key: ${dto.idempotencyKey}`);
      throw new ConflictException(`Action with idempotency key ${dto.idempotencyKey} already executed.`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const record: ActionExecutionResult = {
      executionId,
      decisionId: dto.decisionId,
      actionType: dto.actionType,
      status: 'EXECUTED',
      idempotencyKey: dto.idempotencyKey,
      targetEntity: dto.targetEntity,
      resultPayload: {
        ...dto.payload,
        status: 'SUCCESS',
        processedAt: now.toISOString(),
      },
      executedAt: now,
      completedAt: now,
    };

    this.processedKeys.add(dto.idempotencyKey);
    this.executions.set(executionId, record);
    this.logger.log(`Closed-loop action executed successfully. ID: ${executionId}, Type: ${dto.actionType}`);

    return record;
  }

  async handleCompensation(executionId: string, reason: string): Promise<ActionExecutionResult> {
    const existing = this.executions.get(executionId);
    if (!existing) {
      throw new Error(`Execution record ${executionId} not found for compensation.`);
    }

    existing.status = 'COMPENSATED';
    existing.errorMessage = `Compensated: ${reason}`;
    existing.completedAt = new Date();
    this.executions.set(executionId, existing);

    this.logger.log(`Compensating action completed for execution ID: ${executionId}`);
    return existing;
  }

  async getExecution(executionId: string): Promise<ActionExecutionResult | undefined> {
    return this.executions.get(executionId);
  }
}
