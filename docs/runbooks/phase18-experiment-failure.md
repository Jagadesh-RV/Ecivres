# Phase 18 Runbook — Experiment Failure & Circuit-Breaker Triage

## 1. Overview
This runbook guides on-call engineers when an autonomous experiment is automatically aborted by `ExperimentGuardrailService` or exhibits degraded metric performance.

---

## 2. Trigger Conditions for Automated Circuit Breakers
The autonomous experimentation engine will immediately transition an experiment from `RUNNING` to `TERMINATED` if:
- **Treatment Error Rate**: Exceeds 5.0% over any 5-minute sampling window.
- **Conversion Degradation**: Treatment variant conversion drops > 15.0% relative to control.
- **Complaint Volume**: Spike in customer support tickets or refund requests exceeding 2.5x normal threshold.
- **Budget Depletion**: Allocated promotional incentives exceeded.

---

## 3. Immediate Triage Steps
1. **Verify Automatic Traffic Rollback**:
   Confirm that all incoming traffic has instantly reverted to the control variant:
   `GET /api/v1/autonomous/closed-loop/experiments/:id`
2. **Review Guardrail Breach Reason**:
   Inspect `terminationReason` in the experiment record (e.g. `Error rate threshold breached: 6.2%`).
3. **Analyze Variant Payload**:
   Determine whether the treatment had bad configuration (e.g. invalid pricing discount formula or malformed notification copy).
4. **Inspect Error Logs**:
   Filter application logs by `experimentId` to identify specific client or API exceptions.

---

## 4. Resolution & Post-Mortem
1. Fix underlying defect in application code or experiment configuration.
2. Clone the experiment definition to a new draft (`v2`).
3. Submit new draft through governance review and approval.
4. Document findings in weekly Growth & Experimentation Review.
