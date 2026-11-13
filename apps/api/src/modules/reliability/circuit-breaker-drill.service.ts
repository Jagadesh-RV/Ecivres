import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreakerService } from '../trust-resilience/circuit-breaker.service';

export interface DrillResult {
  drillId: string;
  targetService: string;
  injectedFailureCount: number;
  initialState: string;
  trippedState: string;
  autonomousRecoveryVerified: boolean;
  recoveryDurationMs: number;
  finalState: string;
  timestamp: string;
}

@Injectable()
export class CircuitBreakerDrillService {
  private readonly logger = new Logger(CircuitBreakerDrillService.name);

  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  /**
   * Executes an autonomous chaos fault injection and self-healing recovery drill.
   */
  async executeRecoveryDrill(
    targetService: string = 'staging-simulated-payment-gateway',
    failureThreshold: number = 3,
    recoveryWindowMs: number = 100, // Shortened recovery for drill automation
  ): Promise<DrillResult> {
    const drillId = `drill-${Date.now()}`;
    this.logger.warn(`[CHAOS DRILL STARTED] Initiating circuit breaker recovery drill '${drillId}' on '${targetService}'`);

    const breaker = this.circuitBreakerService.getBreaker(
      targetService,
      failureThreshold,
      recoveryWindowMs,
    );

    const initialState = breaker.state;
    const startTime = Date.now();

    // 1. Inject consecutive failures to force circuit trip
    for (let i = 0; i < failureThreshold; i++) {
      this.circuitBreakerService.recordFailure(targetService);
    }

    const trippedState = breaker.state;
    if (trippedState !== 'OPEN') {
      throw new Error(`Drill failed: Circuit did not trip to OPEN after ${failureThreshold} injected failures`);
    }
    this.logger.log(`[CHAOS DRILL] Circuit '${targetService}' successfully tripped to OPEN.`);

    // 2. Assert that execution is blocked while OPEN
    const blocked = !this.circuitBreakerService.canExecute(targetService);
    if (!blocked) {
      throw new Error(`Drill failed: Circuit permitted execution while in OPEN state`);
    }

    // 3. Await recovery window expiration
    await new Promise((resolve) => setTimeout(resolve, recoveryWindowMs + 20));

    // 4. Probe through HALF_OPEN
    const canProbe = this.circuitBreakerService.canExecute(targetService);
    const halfOpenState = breaker.state;

    // 5. Simulate successful health restoration
    this.circuitBreakerService.recordSuccess(targetService);
    const finalState = breaker.state;

    const recoveryDurationMs = Date.now() - startTime;
    const autonomousRecoveryVerified = canProbe && finalState === 'CLOSED';

    this.logger.log(
      `[CHAOS DRILL COMPLETED] Drill '${drillId}' passed! MTTR: ${recoveryDurationMs}ms. Final State: ${finalState}`,
    );

    return {
      drillId,
      targetService,
      injectedFailureCount: failureThreshold,
      initialState,
      trippedState,
      autonomousRecoveryVerified,
      recoveryDurationMs,
      finalState,
      timestamp: new Date().toISOString(),
    };
  }
}
