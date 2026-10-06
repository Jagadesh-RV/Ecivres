import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EvaluatePolicyDto } from '../dto/evaluate-policy.dto';
import { GuardrailValidatorService } from './guardrail-validator.service';
import { PolicyExecutorService, ExecutionResult } from './policy-executor.service';

@Injectable()
export class PolicyEngineService {
  private readonly logger = new Logger(PolicyEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly guardrailValidator: GuardrailValidatorService,
    private readonly policyExecutor: PolicyExecutorService,
  ) {}

  async evaluateAndExecute(dto: EvaluatePolicyDto): Promise<ExecutionResult & { id: string }> {
    const evaluation = this.guardrailValidator.validate(dto);
    const result = this.policyExecutor.execute(dto, evaluation);

    const logRecord = await this.prisma.autonomousDecisionLog.create({
      data: {
        decisionType: dto.actionType,
        region: dto.region || 'GLOBAL',
        recommendedAction: `Proposed value: ${dto.proposedValue}`,
        expectedImpact: evaluation.allowed ? 'Positive market realignment' : 'Guardrail rejection',
        confidenceScore: 94.5,
        riskLevel: evaluation.requiresHumanReview ? 'HIGH' : 'LOW',
        status: result.status === 'EXECUTED_AUTONOMOUSLY' ? 'EXECUTED' : result.status === 'PENDING_HUMAN_REVIEW' ? 'PENDING_REVIEW' : 'REJECTED',
        reasoning: result.message,
      },
    });

    this.logger.log(`Policy decision ${logRecord.id} evaluated status=${result.status}`);
    return {
      ...result,
      id: logRecord.id,
    };
  }
}
