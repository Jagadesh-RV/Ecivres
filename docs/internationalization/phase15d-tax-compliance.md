# Phase 15D — Global Tax & Compliance Engine

## Tax Calculation Strategy
- **VAT (Value Added Tax)**: UK (20%), EU Germany (19%), UAE (5%).
- **GST (Goods and Services Tax)**: India (18% dual CGST/SGST/IGST), Australia (10%).
- **Sales Tax**: US State/County variable sales tax calculation.

## Business Tax ID Validation
- Indian GSTIN (`27AAPFU0939F1ZV` regex validation).
- US Employer Identification Number (EIN `XX-XXXXXXX`).
- UK VAT ID (`GBXXXXXXXXX`).

## APIs
- `POST /tax-global/calculate`: Compute subtotal, tax amount, and gross total.
- `POST /tax-global/validate-tax-id`: Check country business tax ID syntax.
