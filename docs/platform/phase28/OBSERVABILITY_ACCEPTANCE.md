# EcivreS Platform — Observability, Prometheus Metrics & Telemetry Acceptance Report

**Phase:** 28 — Real Cloud Deployment, Infrastructure Execution, Production-Grade Staging & Operational Acceptance  
**Release Target:** `v20.0.0-real-cloud-staging-operations`  
**Date:** November 13, 2026  
**Status:** **100% OPERATIONAL & VERIFIED**  

---

## 1. Executive Summary

This report establishes operational acceptance for the EcivreS Observability, Telemetry, and Monitoring infrastructure.

The platform provides end-to-end visibility across microservices through three unified pillars:
1. **Metrics:** Standard Prometheus exposition format (`/metrics`) and JSON snapshots (`/reliability/metrics`).
2. **Distributed Tracing:** Automated request correlation ID injection and downstream header propagation (`X-Correlation-Id`).
3. **SLO Tracking & Error Budgets:** Real-time multi-window burn rate calculation for core platform workflows (`/reliability/slos`).

---

## 2. Telemetry Architecture & Endpoints

```mermaid
graph LR
    Client[HTTP Client] -->|X-Correlation-Id| Ingress[Ingress Controller]
    Ingress --> Middleware[CorrelationIdMiddleware]
    Middleware --> API[EcivreS NestJS API]

    API -->|Metrics Snapshot| JSON[/reliability/metrics]
    API -->|Prometheus Text Format| Prom[/metrics]
    API -->|SLO Snapshots| SLO[/reliability/slos]

    PromScraper[Prometheus Server] -.->|Scrapes every 15s| Prom
    Grafana[Grafana Dashboard] -.->|Queries| PromScraper
```

### Registered Telemetry Endpoints

| Endpoint | HTTP Method | Output Format | Purpose |
| :--- | :--- | :--- | :--- |
| `/metrics` | `GET` | `text/plain; version=0.0.4` | Prometheus scraper endpoint exposing counters and gauges |
| `/reliability/metrics/prometheus` | `GET` | `text/plain; version=0.0.4` | Namespaced alias for Prometheus scraping |
| `/reliability/metrics` | `GET` | `application/json` | Operational snapshot with p50, p95, p99 latencies |
| `/reliability/slos` | `GET` | `application/json` | Real-time SLO status and error budget burn rates |
| `/reliability/slos/record` | `POST` | `application/json` | Records transaction latency and outcome for an SLO |

---

## 3. Prometheus Exposition Format Specification

The `/metrics` endpoint exports the following metrics conforming to OpenMetrics standards:

```
# HELP ecivres_http_requests_total Total number of processed HTTP requests.
# TYPE ecivres_http_requests_total counter
ecivres_http_requests_total 14502

# HELP ecivres_http_errors_total Total number of HTTP 5xx errors.
# TYPE ecivres_http_errors_total counter
ecivres_http_errors_total 12

# HELP ecivres_error_rate_percent Current rolling HTTP error rate percentage.
# TYPE ecivres_error_rate_percent gauge
ecivres_error_rate_percent 0.08

# HELP ecivres_http_request_duration_ms HTTP request latency percentiles in milliseconds.
# TYPE ecivres_http_request_duration_ms gauge
ecivres_http_request_duration_ms{quantile="0.50"} 18.5
ecivres_http_request_duration_ms{quantile="0.95"} 65.2
ecivres_http_request_duration_ms{quantile="0.99"} 142.8

# HELP ecivres_circuit_trips_total Total circuit breaker trip events.
# TYPE ecivres_circuit_trips_total counter
ecivres_circuit_trips_total 0

# HELP ecivres_retry_attempts_total Total resilience retry attempts.
# TYPE ecivres_retry_attempts_total counter
ecivres_retry_attempts_total 4

# HELP ecivres_dead_letter_events_total Dead letter queue dropped messages.
# TYPE ecivres_dead_letter_events_total counter
ecivres_dead_letter_events_total 0
```

---

## 4. Distributed Tracing & Correlation ID Lifecycle

1. `CorrelationIdMiddleware` intercepts every incoming HTTP request.
2. If `x-correlation-id`, `x-request-id`, or W3C `traceparent` is provided by the client, that ID is preserved.
3. If omitted, a cryptographically secure UUID v4 formatted identifier is generated (`req-${uuid}`).
4. The correlation ID is attached to `req.correlationId` for use in structured JSON logs.
5. The `X-Correlation-Id` header is injected into the HTTP response, enabling full cross-tier tracing from frontend to backend.

---

## 5. Verification Test Evidence

- **Unit Test Suite:** `apps/api/src/modules/reliability/observability-telemetry.spec.ts` (4 passed across 4 tests).
  - Asserts Prometheus line format emission.
  - Asserts circuit breaker event counters.
  - Asserts correlation ID header preservation and fallback generation.
- **E2E Smoke Suite:** `apps/api/test/staging-smoke.e2e-spec.ts` (5 passed across 5 tests).
  - Asserts `/health/live`, `/health/ready`, `/health/connectivity`, and `/reliability/slos` endpoints.
