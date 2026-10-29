import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CircuitBreakerService } from '../../trust-resilience/circuit-breaker.service';
import {
  IIntegrationAdapter,
  IntegrationProviderType,
  IntegrationHealthCheckResult,
  IntegrationExecutionOptions,
  IntegrationResult,
  IntegrationCircuitOpenException,
} from '../interfaces/integration.interface';
import { PaymentIntegrationAdapter } from '../adapters/payment-integration.adapter';
import { NotificationIntegrationAdapter } from '../adapters/notification-integration.adapter';
import { MappingIntegrationAdapter } from '../adapters/mapping-integration.adapter';
import { AccountingIntegrationAdapter } from '../adapters/accounting-integration.adapter';

@Injectable()
export class IntegrationRegistryService {
  private readonly logger = new Logger(IntegrationRegistryService.name);
  private readonly adapters = new Map<string, IIntegrationAdapter>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly paymentAdapter: PaymentIntegrationAdapter,
    private readonly notificationAdapter: NotificationIntegrationAdapter,
    private readonly mappingAdapter: MappingIntegrationAdapter,
    private readonly accountingAdapter: AccountingIntegrationAdapter,
  ) {
    this.registerAdapter(this.paymentAdapter);
    this.registerAdapter(this.notificationAdapter);
    this.registerAdapter(this.mappingAdapter);
    this.registerAdapter(this.accountingAdapter);
  }

  registerAdapter(adapter: IIntegrationAdapter): void {
    const key = `${adapter.providerType}:${adapter.providerName}`.toUpperCase();
    this.adapters.set(key, adapter);
    this.adapters.set(adapter.providerName.toUpperCase(), adapter);
    this.logger.log(`Registered integration adapter: ${adapter.providerName} (${adapter.providerType})`);
  }

  getAdapter(providerNameOrType: string): IIntegrationAdapter {
    const key = providerNameOrType.toUpperCase();
    const adapter = this.adapters.get(key);
    if (!adapter) {
      throw new NotFoundException(`Integration adapter for '${providerNameOrType}' not found.`);
    }
    return adapter;
  }

  getAdaptersByType(type: IntegrationProviderType): IIntegrationAdapter[] {
    const results: IIntegrationAdapter[] = [];
    for (const [key, adapter] of this.adapters.entries()) {
      if (key.startsWith(`${type}:`.toUpperCase()) && !results.includes(adapter)) {
        results.push(adapter);
      }
    }
    return results;
  }

  async checkAllHealth(): Promise<IntegrationHealthCheckResult[]> {
    const uniqueAdapters = Array.from(new Set(this.adapters.values()));
    const healthPromises = uniqueAdapters.map((adapter) =>
      adapter.healthCheck().catch((err) => ({
        providerName: adapter.providerName,
        providerType: adapter.providerType,
        status: 'UNHEALTHY' as const,
        latencyMs: 0,
        lastCheckedAt: new Date(),
        details: err.message,
      })),
    );

    return Promise.all(healthPromises);
  }

  /**
   * Executes an operation through the adapter wrapped with circuit-breaker protection and telemetry.
   */
  async executeWithResilience<TInput = any, TOutput = any>(
    providerName: string,
    operation: string,
    payload: TInput,
    options?: IntegrationExecutionOptions,
  ): Promise<IntegrationResult<TOutput>> {
    const adapter = this.getAdapter(providerName);

    if (this.circuitBreaker && !this.circuitBreaker.canExecute(adapter.providerName)) {
      this.logger.warn(`Execution blocked: Circuit breaker OPEN for ${adapter.providerName}`);
      throw new IntegrationCircuitOpenException(adapter.providerName);
    }

    const result = await adapter.execute<TInput, TOutput>(operation, payload, options);

    if (result.success) {
      this.circuitBreaker?.recordSuccess(adapter.providerName);
    } else if (result.isTransient) {
      this.circuitBreaker?.recordFailure(adapter.providerName);
    }

    return result;
  }

  async getIntegrationStatus(providerType: string, providerName: string) {
    try {
      const config = await this.prisma.externalIntegrationConfig.findFirst({
        where: { providerType: providerType.toUpperCase(), providerName: providerName.toUpperCase() },
      });
      return config;
    } catch {
      return null;
    }
  }
}
