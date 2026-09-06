# Admin Marketplace Monitoring & Governance Architecture

## Overview

Admin Marketplace Monitoring provides real-time visibility into overall marketplace health, booking state distribution, gross sales volume, provider completion rates, and platform commission ledger.

## Governance & Monitoring Architecture

### Key Performance Indicators (KPIs)

- **Total Marketplace Volume**: Sum of all completed transaction amounts.
- **Platform Commission (10%)**: Automated 10% platform fee retained from all completed bookings.
- **Order State Funnel**:
  - `PENDING`: Unconfirmed client requests.
  - `CONFIRMED`: Scheduled & locked slots.
  - `IN_PROGRESS`: Active service fulfillment.
  - `COMPLETED`: Verified finished jobs.
  - `CANCELLED`: Released/refunded bookings.
- **Fulfillment Completion Rate**: `(Completed Bookings / Total Bookings) * 100%`.

## API Endpoints

- `GET /admin/marketplace-metrics` (Admin only)
  - Returns booking state counts, completion rates, gross sales volume, and user supply/demand stats.

## UI Integration

- **Web Dashboard**: `MarketplaceAnalyticsWidgets.tsx` (`apps/web/src/components/admin/MarketplaceAnalyticsWidgets.tsx`)
- **Mobile Screen**: `AdminMarketplaceMonitoringScreen.tsx` (`apps/mobile/src/screens/AdminMarketplaceMonitoringScreen.tsx`)
