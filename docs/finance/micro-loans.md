# Provider Micro-Loans & Credit Underwriting

## Overview
EcivreS Micro-Loans empower service providers with fast, low-friction micro-credit to purchase equipment, fund inventory, or manage cash flow between payout cycles.

## Automated Underwriting Model
- Risk score evaluates provider rating, completion rate, platform longevity, and requested repayment term.
- Providers with risk scores > 700 qualify for prime interest rates (5.5% APR).
- Scores between 600–700 qualify for standard interest rates (8.0% APR).
- Scores < 600 are declined automatically.

## API Endpoint
- **POST** `/api/v1/finance/micro-loan/apply`
- Payload:
  ```json
  {
    "providerId": "prov_99",
    "requestedAmount": 1000,
    "repaymentTermMonths": 6,
    "purpose": "New plumbing tool set"
  }
  ```
