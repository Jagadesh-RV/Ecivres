import { Injectable, Logger } from '@nestjs/common';
import { EvaluatePolicyDto } from '../dto/evaluate-policy.dto';
import { GuardrailEvaluation } from './guardrail-validator.service';

export interface ExecutionResult {
  executed: boolean;
  status: 'EXECUTED_AUTONOMOUSLY' | 'PENDING_HUMAN_REVIEW' | 'REJECTED_GUARDRAIL_VIOLATION';
  message: string;
}

@Injectable()
export class PolicyExecutorService {
  private readonly logger = new Logger(PolicyExecutorService.name);

  execute(dto: EvaluatePolicyDto, evalRes: GuardrailEvaluation): ExecutionResult {
    if (!evalRes.allowed) {
      this.logger.warn(`Policy action ${dto.actionType} rejected: ${evalRes.violationReason}`);
      return {
        executed: false,
        status: 'REJECTED_GUARDRAIL_VIOLATION',
        message: evalRes.violationReason || 'Action rejected by policy guardrails',
      };
    }

    if (evalRes.requiresHumanReview || !dto.requireAutoExecution) {
      this.logger.log(`Policy action ${dto.actionType} queued for human review`);
      return {
        executed: false,
        status: 'PENDING_HUMAN_REVIEW',
        message: 'Action passed soft guardrails but requires executive sign-off',
      };
    }

    this.logger.log(`Policy action ${dto.actionType} executed autonomously with value ${dto.proposedValue}`);
    return {
      executed: true,
      status: 'EXECUTED_AUTONOMOUSLY',
      message: `Successfully executed ${dto.actionType} with proposed value ${dto.proposedValue}`,
    };
  }
}
