import { Injectable } from '@nestjs/common';
import { EvaluatePolicyDto, PolicyActionType } from '../dto/evaluate-policy.dto';

export interface GuardrailEvaluation {
  allowed: boolean;
  requiresHumanReview: boolean;
  violationReason?: string;
  guardrailLimits: {
    maxSurgePct: number;
    maxTakeRateShiftPct: number;
    maxDailyBudgetUsd: number;
  };
}

@Injectable()
export class GuardrailValidatorService {
  private readonly limits = {
    maxSurgePct: 50,
    maxTakeRateShiftPct: 3,
    maxDailyBudgetUsd: 10000,
  };

  validate(dto: EvaluatePolicyDto): GuardrailEvaluation {
    let allowed = true;
    let requiresHumanReview = false;
    let violationReason: string | undefined;

    switch (dto.actionType) {
      case PolicyActionType.SURGE_PRICING_TRIGGER:
        if (dto.proposedValue > this.limits.maxSurgePct) {
          allowed = false;
          requiresHumanReview = true;
          violationReason = `Surge multiplier increase of ${dto.proposedValue}% exceeds maximum guardrail of ${this.limits.maxSurgePct}%`;
        } else if (dto.proposedValue > 30) {
          requiresHumanReview = true;
        }
        break;

      case PolicyActionType.TAKE_RATE_SHIFT:
        if (Math.abs(dto.proposedValue) > this.limits.maxTakeRateShiftPct) {
          allowed = false;
          requiresHumanReview = true;
          violationReason = `Take rate shift of ${dto.proposedValue}% exceeds maximum guardrail of ±${this.limits.maxTakeRateShiftPct}%`;
        }
        break;

      case PolicyActionType.MARKETING_BUDGET_ALLOCATION:
      case PolicyActionType.PROVIDER_INCENTIVE_DISPATCH:
        if (dto.proposedValue > this.limits.maxDailyBudgetUsd) {
          allowed = false;
          requiresHumanReview = true;
          violationReason = `Budget allocation of $${dto.proposedValue} exceeds daily maximum guardrail of $${this.limits.maxDailyBudgetUsd}`;
        } else if (dto.proposedValue > 5000) {
          requiresHumanReview = true;
        }
        break;
    }

    return {
      allowed,
      requiresHumanReview,
      violationReason,
      guardrailLimits: this.limits,
    };
  }
}
