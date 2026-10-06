# Phase 16B — Marketplace Anomaly Detection Architecture

## Overview
The Anomaly Detection Engine provides deterministic Z-score statistical evaluation on marketplace telemetry (booking spikes/drops, cancellation spikes, payment gateway failures, and fraud signals).

## Components
- `AnomalyRuleService`: Computes Z-scores (`(current - mean) / stdDev`) against baseline statistical models.
- `AnomalyEventService`: Persists anomaly occurrences to Prisma (`Anomaly` table) and manages state transitions (`DETECTED` -> `ACKNOWLEDGED` -> `INVESTIGATING` -> `RESOLVED` / `DISMISSED`).
- `AnomalyDetectionService`: Pipeline coordinating rule evaluation and persistence.

## API Endpoints
- `GET /admin/anomalies`: Fetch filtered anomaly history.
- `POST /admin/anomalies/detect`: Ingest anomaly telemetry manually or from monitoring pipelines.
- `PATCH /admin/anomalies/:id/status`: Update anomaly lifecycle state.
