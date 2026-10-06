import { Injectable, Logger } from '@nestjs/common';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

@Injectable()
export class GatewayCircuitBreakerService {
  private readonly logger = new Logger(GatewayCircuitBreakerService.name);
  private failureCounts = new Map<string, number>();
  private circuitStates = new Map<string, CircuitState>();

  getCircuitState(serviceName: string): CircuitState {
    return this.circuitStates.get(serviceName) || 'CLOSED';
  }

  recordSuccess(serviceName: string) {
    this.failureCounts.set(serviceName, 0);
    this.circuitStates.set(serviceName, 'CLOSED');
  }

  recordFailure(serviceName: string, threshold = 3): CircuitState {
    const current = (this.failureCounts.get(serviceName) || 0) + 1;
    this.failureCounts.set(serviceName, current);

    if (current >= threshold) {
      this.circuitStates.set(serviceName, 'OPEN');
      this.logger.error(`Circuit breaker OPENED for service '${serviceName}' due to ${current} failures`);
      return 'OPEN';
    }
    return 'CLOSED';
  }
}
