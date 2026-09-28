# Phase 15C — Global Payment Infrastructure & Routing

## Multi-Provider Payment Strategy
1. **India Market (`IN` / `INR`)**: Primary routing to Razorpay (NetBanking, Cards) and Razorpay UPI.
2. **Global PayPal Integration**: International cross-border PayPal Checkout SDK support.
3. **Stripe Global Baseline**: USD, EUR, GBP card processing, Apple Pay, and Google Pay wallets.

## APIs
- `POST /payments-global/select-gateway`: Dynamic gateway selection heuristic.
- `POST /payments-global/paypal`: Process PayPal transactions.
- `POST /payments-global/upi`: Process Razorpay UPI VPA payments.
