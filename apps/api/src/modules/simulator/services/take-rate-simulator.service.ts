import { Injectable } from '@nestjs/common';
import { SimulationOutput } from './pricing-simulator.service';

@Injectable()
export class TakeRateSimulatorService {
  simulateTakeRate(changePct: number): SimulationOutput {
    // Reducing take rate boosts provider retention and supply
    const providerEarnings = Number((-1 * changePct * 1.2).toFixed(2));
    const revenueDelta = Number((changePct * 0.9).toFixed(2));
    const conversionImpact = Number((0.2 * Math.abs(changePct)).toFixed(2));

    return {
      gmvDeltaPct: Number((0.5 * Math.abs(changePct)).toFixed(2)),
      revenueDeltaPct: revenueDelta,
      conversionImpactPct: conversionImpact,
      providerEarningsDeltaPct: providerEarnings,
      riskAssessment: changePct < -5 ? 'MEDIUM: Margin compression' : 'LOW: Balanced platform fee',
      recommendation: changePct < 0 ? 'Increase provider retention by lowering fee' : 'Maintain competitive take rate',
    };
  }
}
