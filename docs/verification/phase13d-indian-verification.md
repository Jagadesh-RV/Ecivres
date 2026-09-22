# Phase 13D — Indian Provider Verification & Compliance

## Overview
Provides identity verification for Indian service marketplace providers, supporting Aadhaar hashing, PAN validation, GSTIN registration checks, and business license verification.

## APIs
- `POST /indian-verification/verify-aadhaar`: Provider Aadhaar workflow.
- `POST /indian-verification/verify-pan`: Provider PAN card format validation.
- `POST /indian-verification/verify-gst`: Provider GSTIN registration verification.
- `GET /indian-verification/status/:providerId`: Verification status summary lookup.
