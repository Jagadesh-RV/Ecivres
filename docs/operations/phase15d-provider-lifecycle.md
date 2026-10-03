# Phase 15D — Provider Lifecycle, Activation & Retention Engine

## Architecture Overview
1. **Activation Milestones**: 6 core activation stages:
   - Verification Completed
   - Service Created
   - Portfolio Completed
   - Availability Setup
   - First Booking Completed
   - First Payout Received
2. **Retention & Churn Risk**: Operational churn evaluation categorizing risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) based on days inactive and cancellation frequency with tailored recommendations. Internal risk scores remain protected from direct external exposure.
3. **Provider Health Scoring**: Multi-metric weighted formula calculating overall health score and tier rating (`PLATINUM`, `GOLD`, `SILVER`, `NEEDS_IMPROVEMENT`).

## APIs
- `GET /provider-lifecycle/activation/:providerId`: Provider activation progress.
- `POST /provider-lifecycle/activation/milestone`: Update activation milestone.
- `GET /provider-lifecycle/retention/:providerId`: Assess churn risk and get recommendations.
- `GET /provider-lifecycle/health-score/:providerId`: Retrieve health score and tier rating.
