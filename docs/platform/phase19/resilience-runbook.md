# Phase 19 Runbook — Operational Resilience & Circuit Breakers

## 1. Overview
This runbook guides on-call SREs and platform engineers in diagnosing, managing, and resolving issues related to downstream dependency failures, tripped circuit breakers, and bounded retries.

---

## 2. Circuit Breaker Operations

### 2.1 Inspecting Active Circuit Breakers
Query all downstream dependency states:
```bash
curl -X GET https://api.ecivres.local/api/v1/trust-resilience/resilience/circuit-breakers \
  -H "Authorization: Bearer $SRE_JWT"
```

Response fields:
- `serviceName`: Target dependency (e.g. `PAYMENT_GATEWAY_STRIPE`, `NOTIFICATION_SERVICE`).
- `state`: `CLOSED`, `OPEN`, or `HALF_OPEN`.
- `failureCount`: Consecutive failures recorded.
- `failureThreshold`: Trip threshold (default: 5).
- `recoveryTimeMs`: Cooldown duration (default: 30000ms).

### 2.2 Manual Circuit Breaker Reset
When a downstream provider has restored service and immediate testing is required:
```bash
curl -X POST https://api.ecivres.local/api/v1/trust-resilience/resilience/circuit-breakers/reset \
  -H "Authorization: Bearer $SRE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"serviceName": "PAYMENT_GATEWAY_STRIPE"}'
```

---

## 3. Bounded Retry Triage

1. **Transient Errors**:
   - HTTP 429, 502, 503, 504 and connection timeouts are automatically retried with jittered exponential backoff up to 3 times.
   - If retries fail, operations route to dead-letter storage and return safe degradation responses.
2. **Permanent Errors**:
   - HTTP 400, 401, 403, 404, 409, and schema validation errors fail immediately without wasting retries.
3. **Runaway Loop Mitigation**:
   - If a self-healing action fails repeatedly, `SelfHealingGuardService` trips the loop breaker after 5 attempts per hour and blocks further autonomous retries until an engineer resets it.
