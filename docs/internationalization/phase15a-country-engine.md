# Phase 15A — Multi-Country Marketplace Engine

## Overview
Allows EcivreS to operate as independent country marketplaces with customized currency, tax types, default languages, and payment rails.

## Supported Regional Configurations
- **US**: USD ($), Sales Tax (8.5%), Stripe / Apple Pay / PayPal.
- **IN**: INR (₹), GST (18.0%), Razorpay / UPI / NetBanking.
- **GB**: GBP (£), VAT (20.0%), Stripe / PayPal.
- **AE**: AED (AED), VAT (5.0%), Arabic RTL support.
- **DE**: EUR (€), VAT (19.0%), SEPA / PayPal.

## APIs
- `GET /country/active`: Retrieve active country marketplaces.
- `GET /country/config/:code`: Fetch regional config.
- `POST /country/activate`: Activate new country marketplace.
