# Phase 17 Multi-Agent Swarm Decision Engine Documentation

## Overview
The Multi-Agent Swarm Decision Engine utilizes specialized autonomous agents representing competing operational priorities to debate, negotiate, and reach supermajority consensus on automated platform interventions.

## Participating Agents
- **PricingAgent (Weight 0.35)**: Optimizes yield management, GMV generation, and transaction revenue.
- **SupplyAgent (Weight 0.35)**: Protects service provider retention, density, payout fairness, and marketplace liquidity.
- **RiskAgent (Weight 0.30)**: Enforces systemic safety, brand trust, compliance, and strict volatility caps.

## Consensus Mechanism
- Proposals require a **2/3 (66.6%) weighted supermajority score** to pass.
- Single vetoes by the `RiskAgent` on excessive surge (>30%) prevent unilateral price spikes.
- Every consensus debate and individual agent vote is stored immutably in `AutonomousDecisionLog`.
