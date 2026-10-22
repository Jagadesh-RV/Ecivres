# Phase 18 — Decision Execution Engine Architecture

## 1. Executive Summary
The Phase 18 Decision Execution Engine converts theoretical decision intelligence into safe, governed, observable, and compensable real-world actions across the EcivreS multi-tenant marketplace platform.

---

## 2. Execution Pipeline & State Machine

```
Decision 
   │
   ▼
[Policy Validation] ──(Violation)──► REJECTED / EXPIRED
   │
   ▼
[Authorization & Autonomy Level] ──(L4 Risk / Insufficient Privileges)──► PENDING_APPROVAL
   │
   ▼ (Approved or Auto L2/L3)
[Idempotency Check (SHA-256)] ──(Duplicate)──► CACHED_RESULT
   │
   ▼
[Action Validation (Limits, Payload)] ──(Breach)──► FAILED
   │
   ▼
[Execution Plan & Dispatch]
   │
   ▼
[Execution Attempt] ──(Error)──► [Compensation / Rollback] ──► COMPENSATED / FAILED
   │
   ▼ (Success)
[EXECUTED]
   │
   ▼
[Outcome Capture Registration]
```

### Supported Execution States:
- `GENERATED`: Proposal created by autonomous swarm or operator.
- `RECOMMENDED`: Evaluated by scenario simulation.
- `PENDING_APPROVAL`: High-risk (Autonomy Level 4) or financial decisions waiting for human executive sign-off.
- `APPROVED`: Authorized by executive or automated low-risk governance.
- `VALIDATING`: Action limits and tenant scopes currently under evaluation.
- `SCHEDULED`: Queued for execution window.
- `EXECUTING`: Live dispatch against targeted domain services.
- `PARTIALLY_EXECUTED`: In-flight failure during multi-step operational dispatch.
- `EXECUTED`: Successfully committed to production.
- `COMPENSATING`: Inverse transaction / rollback in progress.
- `COMPENSATED`: Successfully reverted without data corruption.
- `FAILED`: Unrecoverable error recorded with full stacktrace.
- `EXPIRED`: Proposal window passed without approval.
- `CANCELLED`: Interrupted by operator or emergency kill switch.

---

## 3. Core Components

1. **`ActionCatalogService`**:
   - Centralized registry of all permissible autonomous actions.
   - Declares risk tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), autonomy level (0–5), monetary ceilings ($250 for incentives, $50 for customer credits), retry policies, and compensation handlers.
   - Zero generic "execute arbitrary code" or unconstrained capabilities.

2. **`ExecutionValidationService`**:
   - Strict payload schema validation.
   - Enforces financial monetary caps, geographic boundaries, and mandatory parameters.
   - Blocks illegal actions (e.g. negative prices, unauthorized provider suspensions, authentication alterations).

3. **`ExecutionCompensationService`**:
   - Manages atomic rollback workflows.
   - Executes inverse operations (e.g., reverting surge coefficients, cancelling dispatch notifications).
   - Generates ledger audit trails for partial financial interventions.

4. **`DecisionExecutionService`**:
   - Coordinates the end-to-end execution lifecycle.
   - Cryptographic SHA-256 idempotency key generation to prevent double-execution.
   - Integrates with `ProductionQueueService` and event bus (`decision.execution.*`).
   - Persists state transitions transactionally.

---

## 4. Safety & Security Boundaries
- **Tenant Isolation**: Every execution is strictly scoped by `tenantId`. Cross-tenant execution is prevented at the database and query layer.
- **Role-Based Access Control**: Executive approvals require `ADMIN` or `EXECUTIVE` roles. Autonomous agents cannot self-approve Level 4 actions.
- **Monetary Guards**: Hard-coded financial ceilings that cannot be overridden by dynamic agent prompts.
- **Audit Logging**: Every transition logs initiator, timestamp, correlation ID, policy version, and result.
