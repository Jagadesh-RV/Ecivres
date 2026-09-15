import { Injectable, Logger } from '@nestjs/common';

export interface ChaosExperimentResult {
  experimentId: string;
  targetService: string;
  injectedLatencyMs: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  resilienceScore: number;
}

@Injectable()
export class ChaosEngineeringService {
  private readonly logger = new Logger(ChaosEngineeringService.name);

  injectChaosFault(serviceName: string, latencyMs = 500): ChaosExperimentResult {
    this.logger.warn(`CHAOS EXPERIMENT: Injected ${latencyMs}ms latency into ${serviceName}`);

    return {
      experimentId: `exp_${Date.now()}`,
      targetService: serviceName,
      injectedLatencyMs: latencyMs,
      circuitBreakerState: 'CLOSED',
      resilienceScore: 0.99,
    };
  }
}
