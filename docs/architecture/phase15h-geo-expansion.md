# Phase 15H — Geographic Expansion & Multi-Region Architecture

## Hierarchy & Domain Model
- **Region**: Top-level geographic grouping (e.g., North America, Western Europe).
- **Metro**: Metropolitan Statistical Area (e.g., Greater New York, Greater London).
- **City**: City jurisdiction (e.g., New York City, Munich).
- **Zone**: Operational neighborhood boundary with assigned postal code lists.

## Regional Localization & Financial Settlement
- **Localization Configuration**: Dynamic lookup of default currency (`USD`, `EUR`, `GBP`, `CAD`), default tax rate, tax name (`Sales Tax`, `VAT`, `HST`), language code, and time zone per region.
- **Cross-Border FX Settlement**: Standard FX conversion rates with automated 1.5% FX processing fee deduction for cross-currency payouts.

## APIs
- `GET /geo-expansion/zones`: Active expansion zones.
- `GET /geo-expansion/lookup-postal?postalCode=10001`: Zone lookup by postal code.
- `GET /geo-expansion/localization-config?countryCode=GB`: Country localization settings.
- `GET /geo-expansion/cross-border-fx?amount=100&sourceCurrency=USD&targetCurrency=EUR`: Cross-border settlement calculation.
