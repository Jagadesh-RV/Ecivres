# Operational Runbook — BullMQ Job Queue Backlog Recovery

## Symptoms
- Background job processing lag or dead letter queue accumulation.

## Mitigation Steps
1. Monitor queue status via `/operations/queue-telemetry`.
2. Re-queue stalled jobs from dead letter queue.
3. Scale up worker concurrency workers.
