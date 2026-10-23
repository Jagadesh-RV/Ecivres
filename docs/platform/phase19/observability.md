# Phase 19 — Observability & Operational Telemetry
## Bounded Metrics, Prometheus Signals & Health Probes

## 1. Bounded Metric Principles
Under Phase 19 Non-Negotiable Standards, no unbounded identifiers (user IDs, booking IDs, session tokens) may be used as metric dimensions.

### Registered Prometheus Counters:
- `trust_evaluations_total{incidentType="..."}`
- `trust_incident_reviews_total{decision="..."}`
- `trust_appeals_total`
- `decision_explanations_total{policy="..."}`
- `guarded_remediations_total{actionType="..."}`
- `circuit_breaker_failures_total{service="..."}`
- `circuit_breaker_status{service="...",state="..."}`

---

## 2. Health Probes (`/api/v1/trust-resilience/health`)

### Liveness Probe (`GET /health` $\rightarrow$ `liveness: true`)
- Verifies that the NestJS process is responsive and can execute database ping queries (`SELECT 1`).

### Readiness Probe (`GET /health` $\rightarrow$ `readiness: true`)
- Verifies that database connectivity is healthy and no more than two downstream circuit breakers are in an `OPEN` state.
- Exposes pending human moderation queue count and tripped loop breaker count for real-time alerting.
