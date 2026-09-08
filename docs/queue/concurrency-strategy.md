# BullMQ Background Job Concurrency & Retry Policy

## Concurrency Settings
- **Notification Worker**: 10 concurrent worker threads
- **Booking Reminder Worker**: 5 concurrent worker threads
- **Cleanup / Maintenance Worker**: Single-threaded execution (1 concurrency)

## Retry Strategy
- **Max Retries**: 5 attempts
- **Backoff Algorithm**: Exponential backoff (`delay = 2^attempt * 1000ms`)
- **Dead Letter Queue (DLQ)**: Jobs failing after 5 retries are moved to `ecivres-dlq` for manual inspection.
