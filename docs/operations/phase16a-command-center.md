# Phase 16A — Marketplace Command Center Architecture

## Overview
The Marketplace Command Center is the unified control plane providing real-time visibility into marketplace health, financial KPIs, system infrastructure status, active operational alerts, and pending intelligence actions.

## Key Services
- `MarketplaceHealthService`: Calculates live customer/provider counts, booking conversion/completion rates, GMV, take rate, and multi-region infrastructure health status.
- `MarketplaceAlertService`: Monitors active system alerts, anomaly breaches, and infrastructure degradation events.
- `MarketplaceCommandCenterService`: Aggregates health, financial, operational, and alert states into a single unified payload.

## API Endpoints
- `GET /admin/command-center/dashboard`: Unified command center state.
- `GET /admin/command-center/health`: Marketplace customer, provider, and booking metrics.
- `GET /admin/command-center/financial`: GMV, Net Revenue, Take Rate %, and margin indicators.
- `GET /admin/command-center/operational`: Microservices, database, queue, and region health.
- `GET /admin/command-center/alerts`: Active operational alerts.
