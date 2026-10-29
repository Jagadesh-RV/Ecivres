export type IntegrationProviderType = 'PAYMENT' | 'NOTIFICATION' | 'MAPPING' | 'ACCOUNTING';

export type IntegrationHealthStatus = 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';

export interface IntegrationHealthCheckResult {
  providerName: string;
  providerType: IntegrationProviderType;
  status: IntegrationHealthStatus;
  latencyMs: number;
  lastCheckedAt: Date;
  details?: string;
}

export interface IntegrationExecutionOptions {
  timeoutMs?: number;
  retryAttempts?: number;
  idempotencyKey?: string;
  correlationId?: string;
  tenantId?: string;
}

export interface IntegrationResult<T = any> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
  isTransient?: boolean;
  latencyMs: number;
  provider: string;
  timestamp: Date;
}

export interface IIntegrationAdapter {
  readonly providerName: string;
  readonly providerType: IntegrationProviderType;
  healthCheck(): Promise<IntegrationHealthCheckResult>;
  execute<TInput = any, TOutput = any>(
    operation: string,
    payload: TInput,
    options?: IntegrationExecutionOptions,
  ): Promise<IntegrationResult<TOutput>>;
}

export class IntegrationException extends Error {
  constructor(
    public readonly provider: string,
    public readonly operation: string,
    message: string,
    public readonly isTransient: boolean = false,
    public readonly statusCode: number = 502,
  ) {
    super(`[${provider}:${operation}] ${message}`);
    this.name = 'IntegrationException';
  }
}

export class IntegrationTimeoutException extends IntegrationException {
  constructor(provider: string, operation: string, timeoutMs: number) {
    super(provider, operation, `Operation timed out after ${timeoutMs}ms`, true, 504);
    this.name = 'IntegrationTimeoutException';
  }
}

export class IntegrationCircuitOpenException extends IntegrationException {
  constructor(provider: string) {
    super(provider, 'circuit_check', `Circuit breaker is OPEN for ${provider}. Calls rejected.`, false, 503);
    this.name = 'IntegrationCircuitOpenException';
  }
}
