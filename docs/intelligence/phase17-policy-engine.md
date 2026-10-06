# Phase 17 Autonomous Policy Engine & Guardrails Documentation

## Overview
The Autonomous Policy Engine enforces deterministic financial and operational safety guardrails on all automated platform recommendations before execution.

## Strict Guardrails
1. **Surge Pricing**: Maximum automatic surge cap of 50%. Soft threshold of >30% triggers human review.
2. **Take-Rate Shift**: Maximum automatic take-rate adjustment of ±3%.
3. **Daily Budget Limit**: Maximum daily spending budget of $10,000 USD per campaign. Soft threshold of >$5,000 triggers executive review.

## Evaluation States
- `EXECUTED_AUTONOMOUSLY`: Passed all guardrails and soft thresholds; executed instantly.
- `PENDING_HUMAN_REVIEW`: Passed strict caps but exceeded soft thresholds; queued for executive sign-off.
- `REJECTED_GUARDRAIL_VIOLATION`: Exceeded strict guardrail limits; blocked immediately with audit reason logged.
