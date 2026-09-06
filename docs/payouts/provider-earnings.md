# Provider Earnings Integration & Financial Ledger

## Overview

EcivreS maintains an automated financial ledger that tracks gross service sales, platform commissions, escrow pending balances, and net payouts available to providers upon service completion.

## Financial Calculations & Ledger Rules

1. **Gross Revenue**: Sum of payments for services booked with the provider.
2. **Platform Commission Rate**: 10% platform fee deducted on every completed transaction.
3. **Net Lifetime Earnings**: `Gross Revenue * 0.9`.
4. **Pending Escrow Balance**: Net earnings from bookings in `PENDING`, `CONFIRMED`, or `IN_PROGRESS` status (held in escrow until work is delivered).
5. **Available Payout Balance**: Net earnings from bookings marked `COMPLETED` (ready for instant withdrawal request).

## API Endpoints

- `GET /payments/provider/earnings`: Returns provider earnings summary, balance breakdown, and transaction ledger.

## UI Components

- **Web Dashboard Ledger**: `ProviderEarningsLedgerCard.tsx` (`apps/web/src/components/provider/ProviderEarningsLedgerCard.tsx`)
- **Mobile Earnings Screen**: `ProviderEarningsLedgerScreen.tsx` (`apps/mobile/src/screens/ProviderEarningsLedgerScreen.tsx`)
