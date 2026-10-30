# Extensible Integration Framework & Provider Adapters

## 1. Overview
The Integration Framework defines a uniform, pluggable contract for all external service providers. Business logic in EcivreS interacts strictly with provider-agnostic abstractions, ensuring that downstream partners (e.g. payment processors, SMS gateways, geocoders) can be added, switched, or degraded without modifying marketplace workflows.

## 2. Adapter Architecture

```typescript
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
```

## 3. Supported Adapter Types

| Adapter | Provider | Supported Operations |
|---|---|---|
| `PaymentIntegrationAdapter` | Stripe, Razorpay | `create_intent`, `capture_payment`, `refund_payment` |
| `NotificationIntegrationAdapter` | SendGrid, Twilio | `send_email`, `send_sms` |
| `MappingIntegrationAdapter` | Google Maps, Mapbox | `geocode`, `calculate_distance` |
| `AccountingIntegrationAdapter` | QuickBooks, Xero | `sync_invoice`, `sync_ledger` |

## 4. Resilience & Circuit-Breaker Integration
Every outbound execution routed through `IntegrationRegistryService.executeWithResilience()` automatically checks circuit health via `CircuitBreakerService`:
- If circuit is `OPEN`, execution is immediately aborted with `IntegrationCircuitOpenException` (503).
- Successful calls increment recovery counters.
- Transient errors (timeouts, 502/504) increment failure trip counters with jittered backoff.
