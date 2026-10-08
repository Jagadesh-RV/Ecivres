import { Injectable, Logger } from '@nestjs/common';
import { ActionExecutorService, ActionExecutionResult } from './action-executor.service';
import { ExecuteActionDto } from './dto/execute-action.dto';
import { TriggerRemediationDto } from './dto/trigger-remediation.dto';

export interface DecisionOrchestrationSummary {
  decisionId: string;
  totalActions: number;
  status: 'COMPLETED' | 'REMEDIATED' | 'FAILED';
  results: ActionExecutionResult[];
  orchestratedAt: Date;
}

@Injectable()
export class ClosedLoopOrchestratorService {
  private readonly logger = new Logger(ClosedLoopOrchestratorService.name);
  private readonly decisionSummaries = new Map<string, DecisionOrchestrationSummary>();

  constructor(private readonly actionExecutor: ActionExecutorService) {}

  async orchestrateDecision(dtos: ExecuteActionDto[]): Promise<DecisionOrchestrationSummary> {
    if (!dtos || dtos.length === 0) {
      throw new Error('No actions provided for decision orchestration.');
    }

    const decisionId = dtos[0].decisionId;
    this.logger.log(`Starting closed-loop orchestration for decision ID: ${decisionId}`);

    const results: ActionExecutionResult[] = [];
    let hasFailure = false;

    for (const dto of dtos) {
      try {
        const res = await this.actionExecutor.executeAction(dto);
        results.push(res);
      } catch (err: any) {
        this.logger.error(`Action failed during orchestration: ${err.message}`);
        hasFailure = true;
        break;
      }
    }

    const summary: DecisionOrchestrationSummary = {
      decisionId,
      totalActions: results.length,
      status: hasFailure ? 'FAILED' : 'COMPLETED',
      results,
      orchestratedAt: new Date(),
    };

    this.decisionSummaries.set(decisionId, summary);
    return summary;
  }

  async triggerRemediation(dto: TriggerRemediationDto): Promise<ActionExecutionResult> {
    this.logger.log(`Triggering automated remediation for execution ID: ${dto.executionId}`);
    return this.actionExecutor.handleCompensation(dto.executionId, dto.reason);
  }

  async getSummary(decisionId: string): Promise<DecisionOrchestrationSummary | undefined> {
    return this.decisionSummaries.get(decisionId);
  }
}
