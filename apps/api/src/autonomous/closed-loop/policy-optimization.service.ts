import { Injectable, Logger } from '@nestjs/common';

export interface PolicyEffectivenessMetrics {
  policyId: string;
  policyName: string;
  totalEvaluations: number;
  decisionsAllowed: number;
  decisionsBlocked: number;
  rejectionRatePct: number;
  falseRejectionRatePct: number; // Blocked profitable/safe decisions
  breachViolations: number;
  status: 'OPTIMAL' | 'OVERLY_RESTRICTIVE' | 'INEFFECTIVE' | 'UNDER_REVIEW';
  recommendedAction: string;
}

@Injectable()
export class PolicyOptimizationService {
  private readonly logger = new Logger(PolicyOptimizationService.name);

  analyzePolicyEffectiveness(
    policyId: string,
    policyName: string,
    evaluations: { total: number; blocked: number; falseRejections: number; breaches: number },
  ): PolicyEffectivenessMetrics {
    const rejectionRate = evaluations.total > 0 ? Number(((evaluations.blocked / evaluations.total) * 100).toFixed(1)) : 0;
    const falseRejectionRate = evaluations.total > 0 ? Number(((evaluations.falseRejections / evaluations.total) * 100).toFixed(1)) : 0;

    let status: PolicyEffectivenessMetrics['status'] = 'OPTIMAL';
    let recommendedAction = 'Maintain active policy guardrail parameters.';

    if (falseRejectionRate > 15.0) {
      status = 'OVERLY_RESTRICTIVE';
      recommendedAction = `Policy is blocking viable marketplace opportunities (${falseRejectionRate}% false rejection rate). Recommend relaxing threshold by 10% under governance review.`;
    } else if (evaluations.breaches > 5) {
      status = 'INEFFECTIVE';
      recommendedAction = `Policy allowed ${evaluations.breaches} perimeter breaches. Recommend tightening guardrail parameters and enforcing two-tier approval.`;
    }

    const metrics: PolicyEffectivenessMetrics = {
      policyId,
      policyName,
      totalEvaluations: evaluations.total,
      decisionsAllowed: evaluations.total - evaluations.blocked,
      decisionsBlocked: evaluations.blocked,
      rejectionRatePct: rejectionRate,
      falseRejectionRatePct: falseRejectionRate,
      breachViolations: evaluations.breaches,
      status,
      recommendedAction,
    };

    this.logger.log(`Policy evaluation for ${policyId}: status=${status}. Rec=${recommendedAction}`);
    return metrics;
  }
}
