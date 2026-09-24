# Operational Runbook — High Traffic Surge Response (Flash Sale / Spike Event)

## Symptoms
- 10x spike in RPS and search query latency.

## Mitigation Steps
1. Enable Cloudflare Under Attack mode / rate limiter.
2. Scale API deployment replicas to 25.
3. Enable aggressive Redis caching for search results.
