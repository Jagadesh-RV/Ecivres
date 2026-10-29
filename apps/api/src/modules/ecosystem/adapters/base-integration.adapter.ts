import { Logger } from '@nestjs/common';
import {
  IIntegrationAdapter,
  IntegrationProviderType,
  IntegrationHealthCheckResult,
  IntegrationExecutionOptions,
  IntegrationResult,
  IntegrationException,
  IntegrationTimeoutException,
} from '../interfaces/integration.interface';

export abstract class BaseIntegrationAdapter implements IIntegrationAdapter {
  protected readonly logger: Logger;

  constructor(
    public readonly providerName: string,
    public readonly providerType: IntegrationProviderType,
  ) {
    this.logger = new Logger(`IntegrationAdapter[${providerName}]`);
  }

  abstract healthCheck(): Promise<IntegrationHealthCheckResult>;

  protected abstract executeInternal<TInput, TOutput>(
    operation: string,
    payload: TInput,
    options?: IntegrationExecutionOptions,
  ): Promise<TOutput>;

  async execute<TInput = any, TOutput = any>(
    operation: string,
    payload: TInput,
    options?: IntegrationExecutionOptions,
  ): Promise<IntegrationResult<TOutput>> {
    const startTime = Date.now();
    const timeoutMs = options?.timeoutMs ?? 5000;
    const correlationId = options?.correlationId ?? `corr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    this.logger.debug(`[${correlationId}] Starting operation '${operation}' on ${this.providerName}`);

    try {
      const executionPromise = this.executeInternal<TInput, TOutput>(operation, payload, options);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new IntegrationTimeoutException(this.providerName, operation, timeoutMs)), timeoutMs),
      );

      const result = await Promise.race([executionPromise, timeoutPromise]);
      const latencyMs = Date.now() - startTime;

      this.logger.debug(`[${correlationId}] Completed '${operation}' on ${this.providerName} in ${latencyMs}ms`);

      return {
        success: true,
        data: result,
        latencyMs,
        provider: this.providerName,
        timestamp: new Date(),
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const isTransient = err.isTransient ?? (err.name === 'IntegrationTimeoutException' || err.statusCode >= 500);

      this.logger.error(
        `[${correlationId}] Failed '${operation}' on ${this.providerName} (${latencyMs}ms): ${err.message}`,
      );

      return {
        success: false,
        errorCode: err.name ?? 'IntegrationError',
        errorMessage: err.message ?? 'Unknown integration error',
        isTransient,
        latencyMs,
        provider: this.providerName,
        timestamp: new Date(),
      };
    }
  }
}
