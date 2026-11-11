# EcivreS Platform — Observability, Probes & Operational Recovery

**Date:** November 10, 2026  
**Auditor:** Site Reliability Engineer  

---

## 1. Health Probe Topology & Endpoints

Implemented in `apps/api/src/modules/reliability/reliability.controller.ts`:

| Endpoint | Target Probe | HTTP Status | Response Payload Content |
| :--- | :--- | :--- | :--- |
| **`/api/v1/health/live`** | Container Liveness | `200 OK` | Process status (`UP`), uptime in seconds, timestamp |
| **`/api/v1/health/ready`** | Kubernetes Readiness | `200 OK` or `503 Service Unavailable` | Dependency checks (PostgreSQL, Redis, Background Workers) |
| **`/api/v1/health/detailed`** | Deep Diagnostics | `200 OK` | Circuit breaker status, memory footprint, redacted topologies |
| **`/api/v1/ops/metrics`** | Observability Metrics | `200 OK` | Rolling request latencies (p50, p95, p99), error rates |
| **`/api/v1/ops/slo`** | Error Budget Tracking | `200 OK` | SLO availability %, burn rate, remaining budget % |

---

## 2. Fault Injection & Dependency Recovery Verification

Verified via automated test suites in `reliability.spec.ts` and `e2e-deployment.spec.ts`:

### 2.1 Database Latency & Timeout Isolation
- **Scenario**: Simulated 3000ms database query timeout during health check.
- **Outcome**: `/health/ready` transitioned from `READY` to `NOT_READY` with `checks.database.status: "UNAVAILABLE"`.
- **Safety**: Process remained alive without unhandled rejection or worker crash.

### 2.2 Circuit Breaker & Autonomous Self-Healing
- **External Adapter Outage**: After 5 consecutive failures, the circuit breaker tripped from `CLOSED` to `OPEN`, returning degraded fallbacks.
- **Dead-Letter Webhook Redrive**: Autonomous orchestrator executed `REDRIVE_DEAD_LETTER_WEBHOOKS` action with full operator attribution and audit log entry.
- **Kill-Switch Protection**: Confirmed that an active kill switch immediately halted self-healing actions.

### 2.3 Incident Management Lifecycle
- **Incident Declaration**: Automatically classified a high-latency event as a SEV2 incident (`PostgreSQL staging replication latency`).
- **Runbook Linkage**: Linked incident to `/docs/platform/phase23/OPERATIONS_RUNBOOK.md#runbook-database-degradation`.
- **Resolution**: Updated state to `RESOLVED` with timestamp and root-cause justification.
