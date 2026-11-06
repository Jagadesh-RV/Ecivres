# EcivreS Platform — Observability & Telemetry Specification

**Phase:** Phase 23 — Autonomous Reliability, Self-Healing Infrastructure & Operational Excellence  
**Version:** `15.0.0`  
**Status:** Approved & Implemented

---

## 1. Observability Pillars

EcivreS implements three synchronized observability pillars tailored for high-scale, distributed marketplace platforms:
1. **Structured JSON Logging:** High-fidelity contextual event streams with automated secret and PII redaction.
2. **Bounded Metric Telemetry:** Real-time counters, gauges, and percentile distributions protected against high-cardinality degradation.
3. **Correlation & Request Context:** End-to-end transaction tracing via unique correlation IDs.

---

## 2. Structured JSON Logging Schema

Every log entry emitted by `OperationalMetricsService` conforms to the canonical schema:

```json
{
  "timestamp": "2026-11-05T08:35:12.451Z",
  "environment": "production",
  "service": "ecivres-api",
  "correlationId": "req_1793867412_a982",
  "component": "PaymentIntegrationAdapter",
  "operation": "capture_charge",
  "durationMs": 142,
  "outcome": "SUCCESS",
  "severity": "INFO",
  "errorType": null,
  "message": "Payment intent captured successfully",
  "metadata": {
    "provider": "STRIPE",
    "amountMinorUnits": 12500,
    "currency": "USD",
    "token": "[REDACTED]",
    "apiKey": "[REDACTED]"
  }
}
```

### Data Sanitization Safeguards
The logger applies recursive keyword matching across all metadata payloads. Any key containing:
- `password`
- `token`
- `secret`
- `apikey`
- `card`
- `cvv`
- `authorization`
is replaced with `[REDACTED]` prior to serialization.

---

## 3. Bounded Metric Dimensions & Cardinality Protection

### 3.1 The High-Cardinality Vulnerability
In distributed systems, metric storage engines (Prometheus, CloudWatch, Datadog) degrade exponentially if dynamic variables (e.g. User IDs, Booking IDs, arbitrary search queries) are included in metric label sets.

### 3.2 Whitelisted Metric Dimensions
`OperationalMetricsService` enforces strict dimension validation. Only the following 7 label keys are allowed:
- `method` (GET, POST, PUT, DELETE, PATCH)
- `route` (Normalized route path, e.g. `/api/v1/bookings`)
- `status_code` (200, 400, 404, 500, 503)
- `workflow` (authentication, service_discovery, booking_lifecycle, payment_processing, webhook_ingestion)
- `service` (ecivres-api, ecivres-worker, ecivres-web)
- `severity` (INFO, WARN, ERROR)
- `error_type` (TRANSIENT_TIMEOUT, DB_UNAVAILABLE, CIRCUIT_OPEN)

Any attempt to submit labels containing UUIDs, email addresses, or string values exceeding 64 characters is immediately rejected with `BadRequestException`.

---

## 4. Latency Percentiles & Rolling Window

To prevent unbounded heap memory consumption, latency samples are collected in a circular buffer bounded to 1,000 samples. Percentiles are calculated on-demand:
- **p50 (Median):** Represents typical user experience.
- **p95:** Identifies degraded response latency.
- **p99:** Identifies tail latency and resource starvation.

### Telemetry Endpoint: `GET /reliability/metrics`
```json
{
  "timestamp": "2026-11-05T08:35:12.451Z",
  "totalRequests": 145020,
  "totalErrors": 42,
  "errorRatePercent": 0.03,
  "latencies": {
    "p50Ms": 42,
    "p95Ms": 118,
    "p99Ms": 240,
    "sampleCount": 1000
  },
  "circuitTrips": 0,
  "retryAttempts": 12,
  "deadLetterEvents": 1,
  "workflowFailures": {
    "payment_processing": 2,
    "service_discovery": 1
  }
}
```

