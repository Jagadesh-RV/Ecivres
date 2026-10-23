import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

export interface ResilientExecutionOptions {
  serviceName: string;
  timeoutMs?: number;
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  fallbackFn?: () => Promise<any>;
}

export interface ResilientExecutionResult<T> {
  success: boolean;
  data?: T;
  attempts: number;
  durationMs: number;
  circuitState: string;
  fallbackInvoked: boolean;
  error?: string;
}

@Injectable()
export class ResilientExecutionService {
  private readonly logger = new Logger(ResilientExecutionService.name);

  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  /**
   * Executes an asynchronous operation with circuit breaker, timeout, and jittered exponential backoff.
   */
  async executeWithResilience<T>(
    operation: () => Promise<T>,
    options: ResilientExecutionOptions,
  ): Promise<ResilientExecutionResult<T>> {
    const {
      serviceName,
      timeoutMs = 5000,
      maxRetries = 3,
      initialDelayMs = 200,
      maxDelayMs = 3000,
      fallbackFn,
    } = options;

    const startTime = Date.now();
    let attempts = 0;
    let lastError: any = null;

    // 1. Check Circuit Breaker State
    if (!this.circuitBreaker.canExecute(serviceName)) {
      this.logger.warn(`Execution rejected by OPEN circuit breaker for service: ${serviceName}`);
      if (fallbackFn) {
        const fallbackData = await fallbackFn();
        return {
          success: true,
          data: fallbackData,
          attempts: 0,
          durationMs: Date.now() - startTime,
          circuitState: 'OPEN',
          fallbackInvoked: true,
        };
      }
      throw new ServiceUnavailableException(`Downstream service '${serviceName}' circuit is currently OPEN.`);
    }

    // 2. Retry Loop with Exponential Backoff + Jitter
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      attempts++;
      try {
        const result = await this.executeWithTimeout(operation, timeoutMs);
        this.circuitBreaker.recordSuccess(serviceName);
        return {
          success: true,
          data: result,
          attempts,
          durationMs: Date.now() - startTime,
          circuitState: this.circuitBreaker.getBreaker(serviceName).state,
          fallbackInvoked: false,
        };
      } catch (err: any) {
        lastError = err;
        const isTransient = this.classifyError(err);

        // Record failure against the circuit breaker
        this.circuitBreaker.recordFailure(serviceName, isTransient);

        // Permanent errors must fail immediately without wasting retries
        if (!isTransient || attempt === maxRetries) {
          this.logger.warn(
            `Execution failed on attempt ${attempts}/${maxRetries + 1} (${isTransient ? 'exhausted retries' : 'permanent failure'}): ${err?.message}`,
          );
          break;
        }

        // Calculate jittered exponential backoff
        const baseDelay = Math.min(maxDelayMs, initialDelayMs * Math.pow(2, attempt));
        const jitter = Math.random() * 50;
        const sleepDelay = Math.round(baseDelay + jitter);

        this.logger.log(`Transient error on '${serviceName}'. Retrying in ${sleepDelay}ms (attempt ${attempt + 1})...`);
        await new Promise((resolve) => setTimeout(resolve, sleepDelay));
      }
    }

    // 3. Fallback Handling
    if (fallbackFn) {
      this.logger.log(`Invoking fallback function for service: ${serviceName}`);
      const fallbackData = await fallbackFn();
      return {
        success: true,
        data: fallbackData,
        attempts,
        durationMs: Date.now() - startTime,
        circuitState: this.circuitBreaker.getBreaker(serviceName).state,
        fallbackInvoked: true,
        error: lastError?.message,
      };
    }

    return {
      success: false,
      attempts,
      durationMs: Date.now() - startTime,
      circuitState: this.circuitBreaker.getBreaker(serviceName).state,
      fallbackInvoked: false,
      error: lastError?.message || 'Operation failed after retries',
    };
  }

  /**
   * Classifies errors into TRANSIENT (retryable) vs PERMANENT (non-retryable).
   */
  classifyError(err: any): boolean {
    const message = (err?.message || '').toLowerCase();
    const status = err?.status || err?.statusCode;

    // Permanent HTTP errors - do NOT retry
    if (status === 400 || status === 401 || status === 403 || status === 404 || status === 409 || status === 422) {
      return false;
    }

    // Common non-retryable application errors
    if (
      message.includes('validation') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('not found') ||
      message.includes('conflict') ||
      message.includes('invalid argument')
    ) {
      return false;
    }

    // Transient network / server / rate-limit errors - RETRYABLE
    if (
      status === 429 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused') ||
      message.includes('network error') ||
      message.includes('rate limit')
    ) {
      return true;
    }

    // Default to transient for unexpected runtime exceptions
    return true;
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      return await Promise.race([operation(), timeoutPromise]);
    } finally {
      clearTimeout(timer!);
    }
  }
}
