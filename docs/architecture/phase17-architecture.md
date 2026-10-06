# Phase 17 System Architecture — Autonomous Marketplace Decision Intelligence & AI Agent Platform

## 1. Executive System Overview
Phase 17 introduces an end-to-end Decision Intelligence & Controlled AI Agent platform for EcivreS. It moves the system from reactive automation (Phase 16) to proactive intelligence:

`UNDERSTAND → PREDICT → SIMULATE → PLAN → RECOMMEND → REQUEST APPROVAL → EXECUTE → MEASURE → LEARN`

## 2. Multi-Layer Intelligence Architecture

```
+-----------------------------------------------------------------------------------+
|                            Phase 17 Web Admin / Mobile Workspace                  |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                        AI Agent Orchestrator & Multi-Agent Planner                 |
|  (Marketplace, Demand, Revenue, Customer, Provider, Pricing, Trust, Ops Agents)   |
+-----------------------------------------------------------------------------------+
   │                        │                                   │
   ▼                        ▼                                   ▼
+------------------+  +--------------------------------+  +-------------------------+
|  Tool Registry   |  | Safety & Guardrails Engine     |  | Agent Permissions (RBAC)|
|  (Read / Write / |  | (Kill-Switch, Rate Limits,     |  | (AGENT_READ_MARKETPLACE |
|   Financial)     |  |  Max Monetary Thresholds)      |  |  AGENT_EXECUTE_HIGH_RISK|
+------------------+  +--------------------------------+  +-------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                                 Decision Engine Service                           |
|        (Scores Candidate Actions, Calculates Risk & Confidence, Explains Why)     |
+-----------------------------------------------------------------------------------+
        │                                 │                             │
        ▼                                 ▼                             ▼
+-----------------------+     +------------------------+     +----------------------+
| Forecasting Engines   |     | What-If Simulator      |     | Phase 16 Approval    |
| (Demand & Revenue,    |     | (Pricing, Capacity,    |     | Queue                |
|  Exponential Smooth)  |     |  Promo Scenarios)      |     | (If High Risk)       |
+-----------------------+     +------------------------+     +----------------------+
        │                                 │                             │
        └─────────────────────────────────┼─────────────────────────────┘
                                          ▼
+-----------------------------------------------------------------------------------+
|                             Feature Engineering Layer                             |
|          (Normalizes Demand, Supply, Customer, Provider, Financial Signals)      |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                        Phase 16 Command Center & Anomaly Engine                   |
+-----------------------------------------------------------------------------------+
```

## 3. Database Entity Relationship Overview
The Prisma database schema is extended with:
- `DecisionContext`: Holds normalized marketplace telemetry snapshots.
- `Decision`: Candidate and selected marketplace decisions with explainability.
- `ForecastRecord`: Persisted forecasts for demand, GMV, and provider capacity.
- `SimulationScenario` & `SimulationResult`: Read-only scenario simulations.
- `AgentDefinition`, `AgentExecution`, `AgentExecutionStep`: Multi-agent workflows.
- `AgentToolPermission`: Granular permissions per agent and tool.
- `AiEvaluationRecord`: MAE, RMSE, and precision evaluation history.
- `DecisionAuditLog`: Immutable audit ledger for security and compliance.

## 4. Key Security & Governance Policies
1. **Human-in-the-Loop Gate**: Any high-risk decision (pricing adjustments >5%, provider suspensions, refund overrides) MUST create an approval request in Phase 16 `AutomationApprovalService`.
2. **Emergency Kill-Switch**: Administrative toggle (`AGENT_KILL_SWITCH_ENABLED`) instantly disables all autonomous WRITE operations while keeping read-only intelligence active.
3. **No Unrestricted Agents**: Every tool execution is evaluated against User RBAC + Agent Identity + Tool Permission + Policy + Risk Level + Approval State.
