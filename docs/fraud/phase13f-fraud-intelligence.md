# Phase 13F — Fraud Intelligence Engine

## Overview
Detects behavioral anomalies, fake reviews, 3DS step-up payment triggers, device fingerprint reputation, and booking velocity abuse.

## APIs
- `POST /fraud-engine/score-behavior`: Behavioral risk score calculation.
- `POST /fraud-engine/detect-fake-review`: Fake review NLP detector.
- `POST /fraud-engine/detect-payment-anomaly`: High-value payment anomaly & 3DS trigger.
- `GET /fraud-engine/device-reputation/:fingerprint`: Device fingerprint reputation score.
