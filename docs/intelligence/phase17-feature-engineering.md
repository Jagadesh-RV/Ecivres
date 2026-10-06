# Phase 17 Feature Engineering Layer Documentation

## Overview
The Feature Engineering Layer aggregates, normalizes, and extracts real-time marketplace telemetry for consumption by Phase 17 forecasting models, scenario simulators, and autonomous AI agents.

## Feature Categories
1. **Demand Features**: Bookings count, bookings per hour, acceleration %, cancellation rate.
2. **Supply Features**: Active verified providers count, provider utilization %, supply-demand ratio.
3. **Financial Features**: Gross Merchandise Value (GMV), Average Order Value (AOV), take rate %, refund rate %, payout volume.
4. **Operational Features**: API latency ms, payment failure rate %, anomaly count.

## Data Persistence
All extracted feature sets produce an immutable `DecisionContextRecord` snapshot in PostgreSQL via Prisma with a unique `correlationId`.
