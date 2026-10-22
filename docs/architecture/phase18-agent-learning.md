# Phase 18 — Agent Performance & Closed-Loop Learning Architecture

## 1. Overview
The Agent Performance & Learning subsystem (`AgentPerformanceService`) closes the intelligence loop by converting observed real-world outcomes into empirical calibration signals, Brier accuracy scores, and configuration optimizations.

---

## 2. Learning Without Self-Modifying Code
Under Phase 18 Non-Negotiable Principles:
- **No Self-Modifying Code**: Agents are strictly prohibited from editing or overwriting production TypeScript source code or runtime binaries.
- **Governed Learning Model**:
  ```
  Intervention Outcome
          │
          ▼
  Actual vs Expected Delta
          │
          ▼
  Calibration & Brier Score Calculation
          │
          ▼
  Learning Signal Ingestion
          │
          ▼
  Hyperparameter / Weight Adjustment Recommendation
          │
          ▼
  Executive Governance & Policy Review
  ```

---

## 3. Core Metrics Tracked per Agent
1. **Decision Count & Acceptance Rate**: Ratio of recommendations accepted by operators or automatic policies.
2. **Execution Success Rate**: Technical reliability of dispatches originating from the agent.
3. **Commercial Effectiveness Score**: Ratio of decisions evaluated as `SUCCESSFUL` vs `INEFFECTIVE` or `HARMFUL`.
4. **Prediction Accuracy (Brier Calibration)**: Mean squared deviation between expected probability/delta and observed reality.
5. **Decision ROI**: Net dollar yield per dollar spent on interventions initiated by the agent.
6. **False Positive / Negative Rate**: Rate of unneeded interventions or missed critical market anomalies.

---

## 4. Policy Effectiveness Optimization (`PolicyOptimizationService`)
- Evaluates Phase 17 guardrails against historical execution logs.
- Detects overly restrictive policies that unnecessarily reject high-ROI decisions without mitigating actual risk.
- Detects under-protective policies that permit harmful decisions.
- Proposes policy adjustments via `GovernanceService` for human approval.
