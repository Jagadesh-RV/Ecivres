# Phase 19 — Architecture & Component Boundaries
## Autonomous Marketplace Trust, Resilience & Scale

## 1. System Overview
Phase 19 hardens the autonomous capabilities established in Phases 16–18 with real-world trust intelligence, decision explainability, adaptive resilience (circuit breakers and jittered backoff), self-healing safety controls, and bounded observability.

```
                     ┌──────────────────────────────────────────────┐
                     │          Marketplace Event Stream            │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │   MarketplaceTrustService    │
                             │  (Abuse & Anomaly Detection) │
                             └──────────────┬───────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     │                                             │
      (High Risk / Borderline)                       (Deterministic Safe)
                     ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │    Human Moderation       │                 │   Autonomous Decision     │
       │         Queue             │                 │   Intelligence (P17/P18)  │
       └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                     │                                             │
                     └──────────────────────┬──────────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │ DecisionExplainabilityService│
                             │  (Natural Business Summary)  │
                             └──────────────┬───────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │  ResilientExecutionService   │
                             │  (Circuit Breaker + Retries) │
                             └──────────────┬───────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────┐
                             │   SelfHealingGuardService    │
                             │   (Loop Breaker + Quotas)    │
                             └──────────────────────────────┘
```

---

## 2. Component Boundaries

### 2.1 Marketplace Trust & Risk Intelligence (`MarketplaceTrustService`)
- **Responsibility**: Ingests telemetry, evaluates booking velocity, cancellation bursts, review manipulation patterns, and payment attempts.
- **Data Minimization**: Operates on tokenized identifiers and counts; zero storage or logging of raw payment credentials.
- **Routing**: Automatically assigns a severity tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). Items exceeding risk thresholds route to `IN_REVIEW` for human moderation.
- **Appeal Mechanism**: Provides registered appeal workflows allowing users to challenge automated risk flags.

### 2.2 Decision Explainability Engine (`DecisionExplainabilityService`)
- **Responsibility**: Synthesizes business-readable explanations for autonomous actions.
- **Preserved Context**:
  - Initiating event and affected marketplace resource.
  - Policy identifier, policy version, and autonomy level (0–5).
  - Selected action vs. discarded alternatives with trade-off rationale.
  - Confidence score and evidence provenance.
  - Sanitization filter automatically redacts passwords, tokens, API keys, and sensitive fields.

### 2.3 Resilient Execution & Circuit Breakers (`ResilientExecutionService`, `CircuitBreakerService`)
- **Adaptive Circuit Breaker**:
  - `CLOSED`: Normal operation. Failures counted against threshold (default: 5).
  - `OPEN`: Downstream failure threshold reached. All immediate calls fail-fast or route to fallback function.
  - `HALF_OPEN`: Cooldown window (default: 30s) elapsed. Permits single probe execution. Success resets to `CLOSED`; failure trips back to `OPEN`.
- **Bounded Jittered Backoff**:
  $$T_{\text{delay}} = \min(T_{\max}, T_{\text{initial}} \times 2^{\text{attempt}} + \text{jitter})$$
- **Error Classification**:
  - *Transient* (HTTP 429, 502, 503, 504, timeout, connection reset): retried up to `maxRetries`.
  - *Permanent* (HTTP 400, 401, 403, 404, 409, validation error): failed immediately without wasting retry quota.

### 2.4 Governed Self-Healing Safety (`SelfHealingGuardService`)
- **Loop Breaker**: Tracks remediation frequency per `remediationKey`. Exceeding 5 attempts per hour trips the loop breaker, halts automatic remediation, and raises an operational incident.
- **Concurrency Throttling**: Restricts active simultaneous remediations (max 3 concurrent) to prevent cascade contention.
- **Kill Switch Integration**: Strictly checks `KillSwitchService` before executing any remediation; never bypasses safety limits.

### 2.5 Observability & Health Signals (`TrustResilienceMetricsService`)
- **Bounded Cardinality**: Enforces fixed categorical labels (`severity`, `incidentType`, `serviceName`, `state`), strictly preventing unbounded user or booking IDs from polluting telemetry storage.
- **Probes**:
  - Liveness: Database connectivity and event loop responsiveness.
  - Readiness: Database operational and $\le 2$ open circuit breakers.
