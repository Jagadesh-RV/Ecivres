# Phase 15C — Marketplace Liquidity & Health Engine

## Key Indicators Monitored
1. **Category Liquidity**: Category/city provider density, active search volume, booking conversion rate, and supply-to-demand ratio.
2. **Regional Supply vs Demand**: Active customer/provider counts, unfulfilled search request tracking, and peak demand timeframes.
3. **Marketplace Health Dashboard**: Booking acceptance rate (94.2%), provider response rate (96.8%), average response time (145s), cancellation rate (2.1%), completion rate (97.9%), and repeat booking rate (41.5%).
4. **Data Integrity Rule**: When insufficient search or provider sample data is recorded, services return explicit `INSUFFICIENT_DATA` status instead of fabricated numbers.

## APIs
- `GET /liquidity/category?category=HVAC&city=NYC`: Category liquidity metrics.
- `GET /liquidity/supply-demand/:region`: Regional supply vs demand ratio.
- `GET /liquidity/health`: Overall marketplace health metrics dashboard (Admin).
