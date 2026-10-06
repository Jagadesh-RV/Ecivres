import { Injectable } from '@nestjs/common';

export interface SimulationOutput {
  gmvDeltaPct: number;
  revenueDeltaPct: number;
  conversionImpactPct: number;
  providerEarningsDeltaPct: number;
  riskAssessment: string;
  recommendation: string;
}

@Injectable()
export class PricingSimulatorService {
  simulateSurgePricing(changePct: number): SimulationOutput {
    // Elasticity model: demand decreases by 0.6x price increase
    const conversionImpact = Number((-0.6 * changePct).toFixed(2));
    const gmvDelta = Number((changePct * (1 + conversionImpact / 100)).toFixed(2));
    const providerEarnings = Number((changePct * 0.85).toFixed(2));

    return {
      gmvDeltaPct: gmvDelta,
      revenueDeltaPct: gmvDelta,
      conversionImpactPct: conversionImpact,
      providerEarningsDeltaPct: providerEarnings,
      riskAssessment: changePct > 20 ? 'HIGH: Risk of user churn' : 'LOW: Acceptable price elasticity',
      recommendation: changePct > 15 ? 'Apply surge selectively in high-demand zones' : 'Approve pricing adjustment',
    };
  }
}
