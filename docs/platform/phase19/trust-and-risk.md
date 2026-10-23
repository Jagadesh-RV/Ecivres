# Phase 19 — Marketplace Trust & Risk Intelligence
## Signals, Provenance, Policies & Human Review

## 1. Overview
The Marketplace Trust subsystem evaluates suspicious behavior across customers, providers, bookings, and reviews to protect marketplace integrity without compromising user experience or executing premature automated bans.

---

## 2. Risk Heuristics & Signals

| Incident Type | Heuristic / Detection Pattern | Default Action | Escalation |
|---|---|---|---|
| **`BOOKING_ABUSE`** | $\ge 3$ cancellations in short window, velocity $> 10/\text{hr}$ | `FLAG_FOR_REVIEW` | $\ge 5$ cancellations $\rightarrow$ `HOLD_FOR_OPERATOR` |
| **`REVIEW_MANIPULATION`** | $\ge 4$ consecutive 5-star ratings from new accounts, text similarity $> 0.85$ | `HOLD_FOR_OPERATOR` | Provider rating badge frozen pending review |
| **`PAYMENT_VELOCITY`** | $\ge 3$ failed payment transactions in 5 min, card cycling $\ge 4$ cards | `HOLD_FOR_OPERATOR` | Immediate temporary hold on high-value checkout |
| **`PROVIDER_UNRELIABILITY`**| Dispute rate $> 15\%$, no-show rate $> 10\%$ | `FLAG_FOR_REVIEW` | Dispute rate $> 30\% \rightarrow$ Operator review |

---

## 3. Signal Provenance & Data Minimization
Every evaluation record includes:
- `ruleEngineVersion`: Current heuristics version (`v19.1.0`).
- `deterministicChecksPassed`: Boolean verification of hard rule violations.
- `statisticalAnomalyScore`: Normalized probability score $[0.0, 1.0]$.
- **Data Minimization Rule**: No credit card numbers, CVVs, or raw authentication tokens are ever ingested or persisted in the `evidenceSignals` payload.

---

## 4. Human Moderation & Appeals Workflow

1. **Moderation Queue**:
   Flagged items transition to `IN_REVIEW` and appear in the operator moderation queue:
   `GET /api/v1/trust-resilience/trust/queue?tenantId=...`
2. **Review Action**:
   Authorized staff review the evidence and issue a determination:
   - `CONFIRMED`: Evidence confirmed; administrative policy applied.
   - `OVERRIDDEN`: False positive; restriction lifted immediately.
   - `DISMISSED`: Insufficient evidence; flagged status cleared.
3. **User Appeal**:
   Users can submit an appeal through `POST /api/v1/trust-resilience/trust/appeal`, which re-opens the incident under `APPEAL_PENDING_REVIEW` for secondary supervisor evaluation.
