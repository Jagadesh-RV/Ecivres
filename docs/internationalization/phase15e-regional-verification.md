# Phase 15E — Regional Provider Verification Framework

## Country-Specific KYC Rules
- **India (`IN`)**: Aadhaar Card, PAN Card, GST Certificate (optional).
- **United States (`US`)**: SSN/EIN, Driver License, General Liability Insurance.
- **United Kingdom (`GB`)**: UK Passport / NINO, Companies House CRN.
- **United Arab Emirates (`AE`)**: Emirates ID, DED Trade License.

## APIs
- `GET /verification-global/rules/:countryCode`: Fetch mandatory KYC rules.
- `POST /verification-global/verify-doc`: Process regional document verification.
