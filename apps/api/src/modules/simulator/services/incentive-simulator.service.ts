import { Injectable } from '@nestjs/common';
import { SimulationOutput } from './pricing-simulator.service';

@Injectable()
export class IncentiveSimulatorService {
  simulateIncentives(changePct: number): SimulationOutput {
    const supplyCoverage = Number((changePct * 0.75).toFixed(2));
    const gmvDelta = Number((changePct * 0.45).toFixed(2));

    return {
      gmvDeltaPct: gmvDelta,
      revenueDeltaPct: Number((gmvDelta * 0.85).toFixed(2)),
      conversionImpactPct: Number((supplyCoverage * 0.3).toFixed(2)),
      providerEarningsDeltaPct: changePct,
      riskAssessment: 'LOW: High ROI on targeted provider incentive pool',
      recommendation: 'Deploy incentive bonus for peak hour availability',
    };
  }
}
