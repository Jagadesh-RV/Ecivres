# Booking Payment Linkage & Mock Settlement Engine

## Overview

The EcivreS Marketplace links every service booking to an associated payment entity. Phase 6F establishes mock payment settlement to verify end-to-end checkout, provider earnings updates, and order confirmation flows without requiring external Stripe sandbox credentials.

## Payment Linkage Architecture

- **Automatic Payment Creation**: When a booking is created (`POST /bookings`), an associated `Payment` record with status `PENDING` is generated automatically.
- **Mock Settlement Endpoint**: `POST /payments/mock-settle/:bookingId`
  - Generates a unique transaction identifier `MOCK-SETTLE-<timestamp>-<hash>`.
  - Updates payment status to `SUCCESS`.
  - Auto-confirms `PENDING` bookings to `CONFIRMED`.
  - Sends a real-time notification to the provider.

## Financial Breakdown & Provider Earnings Ledger

- **Gross Service Price**: 100% of price set by provider.
- **Platform Fee Rate**: 10% platform commission fee.
- **Net Provider Earnings**: Gross Price - 10% Platform Fee.

## UI Integration Components

- **Web Payment Card**: `PaymentConfirmationCard.tsx` (`apps/web/src/components/payments/PaymentConfirmationCard.tsx`)
- **Mobile Settlement Screen**: `PaymentConfirmationScreen.tsx` (`apps/mobile/src/screens/PaymentConfirmationScreen.tsx`)
