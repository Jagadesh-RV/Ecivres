# Marketplace Trust & Safety Architecture

## Overview
The EcivreS Trust & Safety framework protects both customers and service providers through verification workflows, mutual reporting, admin moderation queues, and automatic fraud detection.

## Key Features

### 1. Provider Verification Workflow
- Verification document submission (Government ID, Business License, Insurance Certificate, Background Check).
- Admin document approval engine (`isVerified` flag update on provider profile).

### 2. Mutual Reporting
- **Customer Reporting**: Allows customers to file reports on providers (e.g. safety violations, unprofessional behavior, no-shows).
- **Provider Reporting**: Allows providers to file reports on customers (e.g. property damage, abusive behavior, non-payment).

### 3. Admin Moderation Queue
- Incident report triage queue (`UNDER_INVESTIGATION`, `RESOLVED`).
- Resolution actions: `DISMISSED`, `WARNING_ISSUED`, `SUSPENDED_ACCOUNT`, `ESCALATED`.

### 4. Automatic Fraud Detection
- Real-time scoring of user cancellation velocity and failed payment patterns.
- Automated risk classification: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- Recommended mitigation actions: `MONITOR`, `FLAG_FOR_REVIEW`, `TEMP_SUSPEND`, `BLOCK`.
