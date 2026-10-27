# Data Lifecycle & Privacy Controls (DSAR)

## 1. Overview
The Data Privacy Lifecycle service automates Data Subject Access Requests (DSAR), user data portability exports, and account pseudonymization.

## 2. Portability Export Bundles
When a user requests their data under GDPR/CCPA portability rights:
- Generates a consolidated JSON data archive containing:
  - User profile details.
  - Historical booking records.
  - Payment transactions and escrow releases.
  - Reviews authored and ratings given.
  - Compliance certification notice.

## 3. Account Deletion & Statutory Exemption Rules
When an account deletion request is processed:
1. Direct personal identifiers (Name, Email, Phone, Address) are pseudonymized.
2. Under statutory tax, commercial law, and AML compliance obligations, financial transaction history, booking invoices, and payment ledgers cannot be deleted.
3. The request is concluded as `COMPLETED` with an explicit legal exemption record:
   `Financial invoices and tax transaction ledgers retained under 7-year statutory financial retention exemption; PII pseudonymized.`
