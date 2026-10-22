# EcivreS Phase 18 — Closed-Loop Architecture & Governance Blueprint

## Executive Overview
Phase 18 completes the autonomous intelligence lifecycle of EcivreS (`v10.0.0-autonomous-marketplace-evolution`).
While Phase 17 established telemetry synthesis, forecasting, scenario simulations, and swarm decision consensus, Phase 18 closes the loop: executing approved decisions under policy guardrails, capturing actual market outcomes, evaluating business effectiveness, generating learning feedback signals, and continuously optimizing future decisions.

---

## 1. Complete Closed-Loop Pipeline

```
             ┌────────────────────────────────────────────────────────┐
             │                   REAL MARKETPLACE                     │
             └───────────────────────────┬────────────────────────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │     TELEMETRY     │ (Marketplace Events, Metrics, Latency)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │   INTELLIGENCE    │ (Feature Engineering: Demand, Supply, Finance)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │    PREDICTION     │ (Forecasting: Demand, Revenue, Volume)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │    SIMULATION     │ (What-If Scenarios, Digital Twin - Read Only)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │     DECISION      │ (Swarm Consensus, Multi-Agent Proposals)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │    GUARDRAILS     │ (Policy Validation & Risk Boundaries)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │     APPROVAL      │ (Human Executive Sign-off for High Risk)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │     EXECUTION     │ (Idempotent, Transaction-Safe Action Executor)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │      OUTCOME      │ (Expected vs Actual Measurement Windows: 1h, 24h, 7d)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │  IMPACT ANALYSIS  │ (Attribution & Baseline Comparison)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │    EVALUATION     │ (Decision Effectiveness: Execution vs Business Success)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │  LEARNING SIGNAL  │ (Agent Calibration, Calibration Feedback, Policy Recs)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │   OPTIMIZATION    │ (Multi-Objective Constrained Optimization)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │  BETTER DECISION  │
                               └─────────┬─────────┘
                                         │
                                         └──────────► (Real Marketplace Adaptation)
```

---

## 2. Core Architectural Pillars

### Pillar 1: Decision Execution Framework (`DecisionExecutionService`)
- **Explicit Execution States**:
  `GENERATED` -> `RECOMMENDED` -> `PENDING_APPROVAL` -> `APPROVED` -> `VALIDATING` -> `SCHEDULED` -> `EXECUTING` -> `PARTIALLY_EXECUTED` -> `EXECUTED` -> `COMPENSATING` -> `COMPENSATED` -> `FAILED` -> `EXPIRED` -> `CANCELLED`.
- **Audit Context**: Every execution maintains decision ID, tenant ID, initiator, agent identity, approval reference, policy version, guardrail version, action parameters, correlation ID, idempotency key, retry count, and outcome reference.
- **Transactional Safety**: Executions run with Prisma transactional consistency and optimistic locking.

### Pillar 2: Governed Action Catalog (`ActionCatalogService`)
All autonomous actions are explicitly registered with defined parameters, validation schemas, and safety boundaries:

| Action Type | Risk Tier | Autonomy Level | Max Monetary Limit | Required Permission | Reversible |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MARKETPLACE_PROMOTION_ADJUST` | MEDIUM | Level 2 | $5,000 | `campaigns:manage` | Yes |
| `PRICING_DYNAMIC_SURGE` | HIGH | Level 3 | 25% shift | `pricing:override` | Yes |
| `PROVIDER_INCENTIVE_PAYOUT` | HIGH | Level 3 | $2,500/provider | `payouts:execute` | No |
| `CUSTOMER_RETENTION_CREDIT` | MEDIUM | Level 2 | $50/user | `finance:credits` | No |
| `OPERATIONAL_REMEDIATION_RETRY` | LOW | Level 1 | $0 | `ops:remediate` | Yes |
| `QUEUE_DEAD_LETTER_RETRY` | LOW | Level 1 | $0 | `queue:manage` | Yes |
| `PROVIDER_RECRUITMENT_OUTREACH` | LOW | Level 2 | $0 | `providers:notify` | No |
| `MARKETPLACE_CAMPAIGN_MODULATE`| MEDIUM | Level 2 | $10,000 | `campaigns:execute` | Yes |

*Rule: No generic "execute anything" action exists. Financial transfers beyond limits strictly require human executive sign-off.*

### Pillar 3: Idempotency & Transaction Safety (`IdempotencyService`)
- Cryptographic idempotency key (`idempotencyKey`) generated per decision action.
- Concurrent and duplicate requests are intercepted and rejected with `409 Conflict`.
- Transactional state transitions guarantee atomic status updates.
- Automatic compensation workflows revert reversible actions if downstream steps fail.

### Pillar 4: Decision Outcome Measurement & Effectiveness (`OutcomeMeasurementService`, `DecisionEffectivenessService`)
- **Outcome Metrics**:
  Measures `GMV`, `CONVERSION_RATE`, `PROVIDER_UTILIZATION`, `PLATFORM_REVENUE`, `CUSTOMER_RETENTION`, `CANCELLATION_RATE`.
- **Measurement Windows**: 1-hour flash impact, 24-hour stabilization, and 7-day longitudinal effect.
- **Metric Deltas**:
  $\Delta = \text{Actual} - \text{Expected}$, $\Delta\% = \frac{\text{Actual} - \text{Expected}}{\text{Expected}} \times 100$.
- **Crucial Decoupling**: Execution Status $\ne$ Business Effectiveness:
  - Execution Status: `EXECUTED`, `FAILED`, `COMPENSATED`.
  - Business Effectiveness: `SUCCESSFUL`, `PARTIALLY_SUCCESSFUL`, `INEFFECTIVE`, `HARMFUL`, `INCONCLUSIVE`.
  - An action can be executed with 100% technical success yet prove commercially ineffective or harmful.

### Pillar 5: Baseline & Impact Analysis (`ImpactAnalysisService`)
- Pre-intervention baseline captured from 24h/7d historical telemetry prior to execution.
- Treatment metrics compared against historical baseline, forecast expectation, and control groups.
- Attribution classifications:
  `OBSERVED`, `PREDICTED`, `SIMULATED`, `ESTIMATED`, `ATTRIBUTED`.
- Strict causal boundaries: Does not claim causality when confounders exist.

### Pillar 6: Marketplace Digital Twin (`DigitalTwinService`)
- High-fidelity, read-only digital twin of the EcivreS marketplace.
- Simulates counterfactual scenarios (Scenario A: Baseline, Scenario B: Dynamic Pricing, Scenario C: Aggressive Subsidies).
- Evaluates projected GMV, revenue, conversion, supply utilization, provider earnings, and operational load.
- **STRICT INVARIANT**: The digital twin is strictly read-only and never mutates production marketplace state.

### Pillar 7: Governed Autonomous Experimentation (`ExperimentationService`)
- Governed A/B testing framework supporting `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `RUNNING`, `PAUSED`, `STOPPING`, `COMPLETED`, `TERMINATED`, `FAILED`.
- Automated Guardrail Breach Termination:
  - If error rate exceeds `errorGuardrailThreshold` (default 5%), the experiment immediately terminates.
  - If conversion collapses by > 20% or complaint rate spikes, the experiment halts autonomously.

### Pillar 8: Continuous Multi-Objective Optimization (`OptimizationEngineService`)
- Constrained optimization engine balancing multiple competing objectives:
  $$\max \left[ w_1 \cdot \text{GMV} + w_2 \cdot \text{Revenue} + w_3 \cdot \text{Conversion} - w_4 \cdot \text{Churn} - w_5 \cdot \text{Refunds} \right]$$
  subject to financial caps, fair take-rate limits, and regulatory constraints.
- Prevents single-metric optimization pathologies (e.g., maximizing revenue by spiking prices that cause provider churn).

### Pillar 9: Agent Performance & Closed-Loop Learning (`AgentPerformanceService`)
- Tracks individual and swarm agent performance metrics:
  - Recommendation acceptance rate
  - Execution success rate
  - Business effectiveness rate
  - Prediction accuracy and calibration score
  - False positive and false negative rates
  - Decision Return on Investment (ROI)
- Emits structured learning feedback signals (`AgentLearningFeedback`) to adjust decision weights and confidence thresholds.
- **STRICT INVARIANT**: Agents NEVER self-modify production code. Learning operates strictly through governed configuration and policy recommendations.

### Pillar 10: Policy Optimization Engine (`PolicyOptimizationService`)
- Evaluates policy guardrail behavior over time.
- Identifies policies that are overly restrictive (blocking profitable, low-risk actions) or ineffective.
- Recommends policy adjustments through simulation, governance approval, and canary deployment.

### Pillar 11: Controlled Self-Healing Operations (`SelfHealingService`)
- Operational incident detection and auto-remediation:
  `DETECT` -> `CLASSIFY` -> `VERIFY` -> `PROPOSE REMEDIATION` -> `POLICY CHECK` -> `EXECUTE` -> `VERIFY RESULT` -> `RECORD OUTCOME`.
- Handles failed queue workers, stuck workflows, notification retries, and stale cache flushes.
- High-risk operations (security, authentication, IAM, permanent data modification) require human executive sign-off.

### Pillar 12: Drift Detection Engine (`DriftDetectionService`)
- Monitors feature distributions, forecast errors, prediction drift, and market regime changes.
- Computes Kolmogorov-Smirnov / Population Stability Index (PSI) drift scores.
- Triggers alerts and recommends model recalibration when drift thresholds are breached.

### Pillar 13: Governance 2.0 & Autonomy Levels (`GovernanceService`, `AutonomySafetyService`)
- Complete entity lifecycle management:
  `DRAFT` -> `EVALUATING` -> `APPROVED` -> `ACTIVE` -> `MONITORED` -> `DEPRECATED` -> `RETIRED`.
- Applied uniformly across agents, models, policies, experiments, and actions.
- **Autonomy Levels (0 to 5)**:
  - **Level 0**: Observe only (telemetry capture).
  - **Level 1**: Recommend only (human executes).
  - **Level 2**: Execute low-risk actions automatically under pre-approved policies.
  - **Level 3**: Execute medium-risk actions under validated policies and guardrails.
  - **Level 4**: Execute high-impact actions only with explicit human executive approval.
  - **Level 5**: Emergency autonomous remediation only for whitelisted safe operations.

### Pillar 14: Multi-Tier Kill Switch (`KillSwitchService`)
- Emergency execution termination across five scopes:
  1. `GLOBAL`: Halts all autonomous execution platform-wide.
  2. `TENANT`: Halts autonomous actions for a specific tenant.
  3. `AGENT`: Disables a specific autonomous agent.
  4. `ACTION`: Halts a specific action type (e.g., freeze all surge pricing).
  5. `EXPERIMENT`: Halts a running experimentation campaign.
- All kill switch events are immutably logged with actor, reason, timestamp, and audit trail.

---

## 3. Database Schema Models (Prisma)
1. `ClosedLoopExecution`: Primary execution lifecycle and transaction record.
2. `ActionCatalogRecord`: Registered action definitions and risk rules.
3. `DecisionOutcomeRecord`: Quantitative expected vs actual measurements.
4. `DecisionEffectivenessLog`: Qualitative business effectiveness evaluations and ROI.
5. `ExperimentationRecord`: Governed A/B testing definitions and results.
6. `OptimizationRunLog`: Multi-objective optimization execution log.
7. `AgentLearningFeedback`: Feedback signals for agent calibration.
8. `DriftDetectionRecord`: Feature and prediction drift alerts.
9. `GovernanceLifecycleRecord`: Lifecycle state transitions and audit logs.
10. `KillSwitchLog`: Emergency kill switch activation records.
