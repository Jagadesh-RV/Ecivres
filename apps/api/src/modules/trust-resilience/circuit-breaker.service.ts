import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerState {
  serviceName: string;
  state: CircuitState;
  failureCount: number;
  successCount: number;
  failureThreshold: number;
  recoveryTimeMs: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  lastStateChange: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breakers = new Map<string, CircuitBreakerState>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes or fetches a circuit breaker for a downstream dependency.
   */
  getBreaker(
    serviceName: string,
    failureThreshold: number = 5,
    recoveryTimeMs: number = 30000,
  ): CircuitBreakerState {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, {
        serviceName,
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        failureThreshold,
        recoveryTimeMs,
        lastStateChange: Date.now(),
      });
    }
    return this.breakers.get(serviceName)!;
  }

  /**
   * Evaluates whether an execution attempt is permitted through the circuit.
   */
  canExecute(serviceName: string): boolean {
    const breaker = this.getBreaker(serviceName);
    const now = Date.now();

    if (breaker.state === 'CLOSED') {
      return true;
    }

    if (breaker.state === 'OPEN') {
      // Check if recovery window has passed to transition to HALF_OPEN
      if (now - breaker.lastStateChange >= breaker.recoveryTimeMs) {
        breaker.state = 'HALF_OPEN';
        breaker.lastStateChange = now;
        this.logger.warn(`Circuit Breaker for '${serviceName}' transitioning from OPEN to HALF_OPEN (probing)`);
        this.persistBreakerState(breaker);
        return true;
      }
      return false; // Still within cooldown
    }

    if (breaker.state === 'HALF_OPEN') {
      // Allow single probe execution
      return true;
    }

    return false;
  }

  /**
   * Records a successful execution through the circuit.
   */
  recordSuccess(serviceName: string): void {
    const breaker = this.getBreaker(serviceName);
    breaker.lastSuccessTime = Date.now();

    if (breaker.state === 'HALF_OPEN') {
      breaker.state = 'CLOSED';
      breaker.failureCount = 0;
      breaker.successCount += 1;
      breaker.lastStateChange = Date.now();
      this.logger.log(`Circuit Breaker for '${serviceName}' reset to CLOSED following successful probe`);
      this.persistBreakerState(breaker);
    } else {
      breaker.failureCount = 0;
      breaker.successCount += 1;
    }
  }

  /**
   * Records a failed execution through the circuit.
   */
  recordFailure(serviceName: string, isTransient: boolean = true): void {
    const breaker = this.getBreaker(serviceName);
    breaker.lastFailureTime = Date.now();
    breaker.failureCount += 1;

    if (breaker.state === 'HALF_OPEN') {
      breaker.state = 'OPEN';
      breaker.lastStateChange = Date.now();
      this.logger.error(`Circuit Breaker probe failed for '${serviceName}'. Reopening circuit to OPEN`);
      this.persistBreakerState(breaker);
    } else if (breaker.state === 'CLOSED' && breaker.failureCount >= breaker.failureThreshold) {
      breaker.state = 'OPEN';
      breaker.lastStateChange = Date.now();
      this.logger.error(
        `Circuit Breaker for '${serviceName}' TRIPPED from CLOSED to OPEN (${breaker.failureCount} consecutive failures)`,
      );
      this.persistBreakerState(breaker);
    }
  }

  /**
   * Returns current snapshot of all active circuit breakers.
   */
  getAllBreakerSnapshots(): CircuitBreakerState[] {
    return Array.from(this.breakers.values());
  }

  /**
   * Manually resets a circuit breaker.
   */
  resetBreaker(serviceName: string): void {
    const breaker = this.getBreaker(serviceName);
    breaker.state = 'CLOSED';
    breaker.failureCount = 0;
    breaker.lastStateChange = Date.now();
    this.logger.log(`Circuit Breaker for '${serviceName}' manually reset to CLOSED`);
    this.persistBreakerState(breaker);
  }

  private async persistBreakerState(breaker: CircuitBreakerState) {
    try {
      await this.prisma.circuitBreakerStateRecord.upsert({
        where: { serviceName: breaker.serviceName },
        update: {
          state: breaker.state,
          failureCount: breaker.failureCount,
          successCount: breaker.successCount,
          lastFailureAt: breaker.lastFailureTime ? new Date(breaker.lastFailureTime) : null,
          lastSuccessAt: breaker.lastSuccessTime ? new Date(breaker.lastSuccessTime) : null,
          lastStateChangeAt: new Date(breaker.lastStateChange),
        },
        create: {
          serviceName: breaker.serviceName,
          state: breaker.state,
          failureCount: breaker.failureCount,
          successCount: breaker.successCount,
          failureThreshold: breaker.failureThreshold,
          recoveryTimeMs: breaker.recoveryTimeMs,
          lastFailureAt: breaker.lastFailureTime ? new Date(breaker.lastFailureTime) : null,
          lastSuccessAt: breaker.lastSuccessTime ? new Date(breaker.lastSuccessTime) : null,
          lastStateChangeAt: new Date(breaker.lastStateChange),
        },
      });
    } catch {
      // ignore db errors in fast-path
    }
  }
}
