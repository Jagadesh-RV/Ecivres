# Regional & International Marketplace Readiness

## 1. Overview
EcivreS supports multi-region marketplace operations across North America, Europe, Asia, and the Middle East without hardcoded country-specific branching in core modules.

## 2. Supported Marketplace Regions

| Region Code | Name | Default Currency | Tax Regime | Base Tax Rate | Default Locale | Primary Timezone |
|---|---|---|---|---|---|---|
| `US` | United States | `USD` ($) | `SALES_TAX` | 8.5% | `en-US` | `America/New_York` |
| `IN` | India | `INR` (₹) | `GST` | 18.0% | `hi-IN` | `Asia/Kolkata` |
| `GB` | United Kingdom | `GBP` (£) | `VAT` | 20.0% | `en-GB` | `Europe/London` |
| `AE` | United Arab Emirates | `AED` (AED) | `VAT` | 5.0% | `ar-AE` | `Asia/Dubai` |
| `DE` | Germany | `EUR` (€) | `VAT` | 19.0% | `de-DE` | `Europe/Berlin` |
| `SG` | Singapore | `SGD` (S$) | `GST` | 9.0% | `en-SG` | `Asia/Singapore` |
| `JP` | Japan | `JPY` (¥) | `VAT` | 10.0% | `ja-JP` | `Asia/Tokyo` |

## 3. Regional Policy & Cancellation Guardrails
- **Statutory Consumer Protection**: Germany and the UK enforce strict cooling-off and cancellation windows ($>24\text{h} \rightarrow 100\%$ refund, $>12\text{h} \rightarrow 50\%$).
- **Taxation Engine**: Dynamically calculates inclusive and exclusive tax lines with exact basis-point rounding based on buyer jurisdiction.
- **Address & Postal Formatting**: Validates localized zip/postal code structures and renders region-standard dispatch labels.
