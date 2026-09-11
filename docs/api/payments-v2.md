# Payments 2.0 & Digital Wallet API Reference

## Endpoints

### 1. Digital Wallet Balance & Top-Up
- `GET /api/v1/payments/wallet/balance`
  - Returns current available wallet balance and cashback total.
- `POST /api/v1/payments/wallet/topup`
  - Body: `{ amount: number, paymentMethod: string }`

### 2. Gift Card Redemption
- `POST /api/v1/payments/wallet/redeem-giftcard`
  - Body: `{ code: string }`
  - Credits full gift card value to user's wallet.

### 3. Split Payment Booking
- `POST /api/v1/payments/split`
  - Body: `{ bookingId: string, totalAmount: number, emails: string[] }`
  - Splits bill evenly and notifies co-payers via email.

### 4. EMI Installments Calculation
- `GET /api/v1/payments/emi-options?amount=1200`
  - Returns 3, 6, and 12-month installment breakdown.
