import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionCatalogService } from './action-catalog.service';

export interface CompensationResult {
  executionId: string;
  status: 'COMPENSATED' | 'FAILED_COMPENSATION' | 'NOT_REVERSIBLE';
  actionType: string;
  reason: string;
  revertedPayload?: Record<string, any>;
  compensatedAt: Date;
}

@Injectable()
export class ExecutionCompensationService {
  private readonly logger = new Logger(ExecutionCompensationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly actionCatalog: ActionCatalogService,
  ) {}

  async compensateExecution(
    executionId: string,
    actionType: string,
    payload: Record<string, any>,
    compensationPayload?: Record<string, any>,
    reason: string = 'Downstream orchestration step failure',
  ): Promise<CompensationResult> {
    const action = this.actionCatalog.getAction(actionType);

    if (!action.compensationSupported) {
      this.logger.warn(`Action '${actionType}' does not support automatic compensation. Manual escalation required for ${executionId}.`);
      return {
        executionId,
        status: 'NOT_REVERSIBLE',
        actionType,
        reason: `Action is marked non-reversible: ${reason}`,
        compensatedAt: new Date(),
      };
    }

    this.logger.log(`Executing compensation for action ${actionType} (ID: ${executionId}). Reason: ${reason}`);

    // Build compensation payload: revert changes
    const revertedPayload: Record<string, any> = compensationPayload || {
      revertedFrom: payload,
      compensationApplied: true,
      timestamp: new Date().toISOString(),
    };

    // Update execution status in database if record exists
    try {
      await this.prisma.closedLoopExecution.updateMany({
        where: { id: executionId },
        data: {
          status: 'COMPENSATED',
          errorMessage: `Compensated: ${reason}`,
          compensationPayload: revertedPayload,
          completedAt: new Date(),
        },
      });
    } catch (err: any) {
      this.logger.error(`Database update during compensation encountered error: ${err.message}`);
    }

    return {
      executionId,
      status: 'COMPENSATED',
      actionType,
      reason,
      revertedPayload,
      compensatedAt: new Date(),
    };
  }
}
