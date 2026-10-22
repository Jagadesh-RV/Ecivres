# Phase 18 — Autonomous Experimentation Framework Architecture

## 1. Overview
The Autonomous Experimentation Framework (`ExperimentationService`) provides continuous, mathematically rigorous, and safety-constrained A/B and multi-armed bandit testing across the marketplace.

---

## 2. Experiment Lifecycle & State Transitions

```
[DRAFT] ──► [EVALUATING] ──► [PENDING_APPROVAL] ──► [APPROVED]
                                                         │
                                                         ▼
[TERMINATED] ◄──(Safety Breach / Kill Switch)── [RUNNING] ◄──► [PAUSED]
      ▲                                                  │
      │                                                  ▼
[FAILED] ◄─────────────────────────────────────── [COMPLETED]
```

### Supported Lifecycle States:
- `DRAFT`: Experiment parameters and hypotheses defined.
- `PENDING_APPROVAL`: Guardrail analysis completed, awaiting operational sign-off.
- `APPROVED`: Ready for live traffic allocation.
- `RUNNING`: Actively serving variant treatments.
- `PAUSED`: Temporarily suspended during platform maintenance or manual review.
- `STOPPING`: Ramping down variant traffic safely.
- `COMPLETED`: Planned sample size reached and evaluation synthesized.
- `TERMINATED`: Automatically aborted due to metric anomaly or safety threshold breach.
- `FAILED`: Technical fault in metric ingestion or routing.

---

## 3. Variant Assignment & Deterministic Routing
- **Deterministic Hashing**: User assignments are computed via `MurmurHash3` / SHA-256 over `(tenantId, experimentId, entityId)`.
- **Zero Collision Guarantee**: Variant buckets (e.g. 50/50 control/treatment) remain consistent across repeat sessions without persistent state overhead.
- **Fair Split**: Sample ratios strictly enforced across geographic segments and service categories.

---

## 4. Automatic Circuit Breakers & Safety Guardrails
Experiments are continuously monitored by `ExperimentGuardrailService`. An experiment is automatically terminated within one polling window (under 60 seconds) if:
1. **Error Rate Spike**: Error rate in any active treatment variant exceeds 5.0%.
2. **Conversion Collapse**: Booking conversion drops by more than 15.0% relative to the control group.
3. **Dispute / Cancellation Threshold**: Cancellations or customer complaints rise beyond 2.5x baseline.
4. **Monetary Cap Exceeded**: Total promotional or incentive spend exceeds allocated budget.

When terminated, traffic instantly reverts 100% to the control baseline, and a high-priority incident is logged to the Executive Command Center.
