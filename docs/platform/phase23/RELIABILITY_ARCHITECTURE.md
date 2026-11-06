# EcivreS Platform — Reliability Architecture Specification

**Phase:** Phase 23 — Autonomous Reliability, Self-Healing Infrastructure & Operational Excellence  
**Version:** `15.0.0`  
**Status:** Approved & Implemented  
**Lead Architect:** Principal SRE & Platform Architect (Jagadesh R <jagadeshrvs@gmail.com>)

---

## 1. Architectural Overview

EcivreS Phase 23 introduces an enterprise-grade Autonomous Reliability, Self-Healing Infrastructure, and Operational Excellence architecture. The goal of this architecture is to provide high availability, resilient degradation, bounded autonomous self-healing, and actionable operational observability across all layers of the marketplace platform.

```
+---------------------------------------------------------------------------------------+
|                                    Client Layer                                       |
|                  (Web Next.js App, Mobile React Native, Partner APIs)                 |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                           Ingress & Edge Routing Layer                                |
|                        (Nginx Reverse Proxy / API Gateway)                            |
+---------------------------------------------------------------------------------------+
        |                                       |                               |
        | /health/live                          | /health/ready                 | Core APIs
        v                                       v                               v
+------------------+                   +------------------+           +------------------+
| Fast Liveness    |                   | Bounded Readiness|           | Graceful Shutdown|
| Probe (<50ms)    |                   | Probe (<2000ms)  |           | Interceptor      |
+------------------+                   +------------------+           +------------------+
                                                |                               |
                                                +---------------+---------------+
                                                                |
                                                                v
+---------------------------------------------------------------------------------------+
|                               NestJS API Service Engine                               |
|  +---------------------------------------------------------------------------------+  |
|  | Reliability Module (apps/api/src/modules/reliability)                           |  |
|  |                                                                                 |  |
|  |  +--------------------------+  +--------------------------+  +----------------+ |  |
|  |  | DependencyHealthService  |  | OperationalMetricsService|  | SloTracker     | |  |
|  |  | - Process Liveness       |  | - Rolling Percentiles    |  | - SLI Trackers | |  |
|  |  | - Bounded DB SELECT 1    |  | - Bounded Metric Labels  |  | - Error Budget | |  |
|  |  | - Topology Sanitization  |  | - Structured JSON Logs   |  | - Burn Rate    | |  |
|  |  +--------------------------+  +--------------------------+  +----------------+ |  |
|  |                                                                                 |  |
|  |  +--------------------------+  +--------------------------+  +----------------+ |  |
|  |  | SelfHealingOrchestrator  |  | GracefulShutdownService  |  | IncidentMgr    | |  |
|  |  | - DLQ Redrive (<10 batch)|  | - In-Flight Request Drain|  | - SEV1-4 Class | |  |
|  |  | - Circuit Breaker Reset  |  | - Connection Pool Close  |  | - Runbook Map  | |  |
|  |  | - Feature Dampening      |  | - Bounded Drain Timeout  |  | - State Track  | |  |
|  |  +--------------------------+  +--------------------------+  +----------------+ |  |
|  +---------------------------------------------------------------------------------+  |
|                                           |                                           |
|       +-----------------------------------+-----------------------------------+       |
|       v                                   v                                   v       |
|  +----------------------+       +----------------------+       +--------------------+ |
|  | CircuitBreakerService|       | SelfHealingGuard     |       | KillSwitchService  | |
|  | (trust-resilience)   |       | (Loop Breaker max 5) |       | (Emergency Halt)   | |
|  +----------------------+       +----------------------+       +--------------------+ |
+---------------------------------------------------------------------------------------+
                                           |
                    +----------------------+----------------------+
                    v                                             v
+---------------------------------------+     +-----------------------------------------+
|        PostgreSQL Database            |     |        External Integrations            |
|  (Connection Pool & Prisma ORM)       |     |  (Payment, SMS, Mapping, Accounting)    |
+---------------------------------------+     +-----------------------------------------+
```

---

## 2. Component Responsibilities

### 2.1 DependencyHealthService
- **Liveness (`/health/live`):** Performs process health check (<50ms) to ensure event loop responsiveness and Node.js process survival without touching databases or networks.
- **Readiness (`/health/ready`):** Executes bounded database query (`SELECT 1`, timeout < 2000ms) and evaluates memory heap ratio (<92%). Returns HTTP 200 when ready or degraded, HTTP 503 when critical stores are offline.
- **Deep Diagnostics (`/health/dependencies`):** Aggregates database latency, external adapter health statuses, circuit breaker states, and system memory allocations. Redacts connection strings, passwords, and private IP topologies.

### 2.2 OperationalMetricsService
- **Rolling Latency Percentiles:** Maintains a circular sliding window (1,000 samples) to compute p50, p95, and p99 request latencies without unbounded heap growth.
- **High-Cardinality Label Guard:** Enforces strict whitelist validation (`method`, `route`, `status_code`, `workflow`, `service`, `severity`, `error_type`), blocking high-cardinality values such as UUIDs, emails, or booking IDs.
- **Structured JSON Logging:** Emits machine-readable logs containing ISO timestamp, correlation ID, component, duration, outcome, and recursively sanitized metadata.

### 2.3 SloTrackerService
- Tracks Service-Level Indicators (SLIs) for 5 core marketplace workflows:
  1. `authentication` (99.95% target, 150ms latency target)
  2. `service_discovery` (99.90% target, 200ms latency target)
  3. `booking_lifecycle` (99.99% target, 300ms latency target)
  4. `payment_processing` (99.99% target, 500ms latency target)
  5. `webhook_ingestion` (99.90% target, 250ms latency target)
- Calculates error budget consumption, remaining percentage, and burn rate. Automatically triggers alert recommendations when error budget drops below 10% or burn rate exceeds 2.0x.

### 2.4 SelfHealingOrchestratorService
- Provides governed automated recovery actions:
  - `REDRIVE_DEAD_LETTER_WEBHOOKS`: Bounded batch of max 10 events.
  - `RESET_TRIPPED_CIRCUIT_BREAKER`: Restores circuit breaker to CLOSED after cooldown validation.
  - `DAMPEN_UNHEALTHY_INTEGRATION`: Activates non-critical feature dampening to preserve core booking workflows.
  - `THROTTLE_BACKGROUND_WORKERS`: Reduces concurrency during connection pool spikes.
  - `RECONNECT_RESOURCE`: Performs health probe reconnection on degraded stores.
- Safety Guardrails: Integrated with `SelfHealingGuardService` (max 5 executions/hour loop breaker) and `KillSwitchService` (emergency halts). Actions requiring operator attribution are gated behind approval requirements.

### 2.5 GracefulShutdownService
- Implements NestJS `OnApplicationShutdown`.
- Rejects inbound requests during termination, drains in-flight requests within a bounded 10-second window, and cleanly disconnects Prisma PostgreSQL connection pools.

### 2.6 IncidentManagerService
- Classifies incidents across SEV1 to SEV4.
- Maps incident signatures directly to actionable operational runbook URLs.
- Tracks incident lifecycle states (`OPEN` -> `INVESTIGATING` -> `MITIGATED` -> `RESOLVED`).

