# Minor-Unit Currency Mathematics & Precision Engine

## 1. Overview
Financial correctness across global marketplaces requires absolute precision. Floating-point arithmetic (IEEE 754) introduces cumulative rounding errors in prices, taxes, and refunds. EcivreS strictly represents all currency values in **integer minor units** (e.g. cents, pence, paise).

## 2. Monetary Precision Specification

| Currency | ISO Code | Minor Unit Decimals | Multiplier ($1.00 \rightarrow$ Minor Units) |
|---|---|---|---|
| US Dollar | `USD` | 2 | 100 ($10.50 \rightarrow 1050) |
| Euro | `EUR` | 2 | 100 (€10.50 $\rightarrow 1050) |
| British Pound | `GBP` | 2 | 100 (£10.50 $\rightarrow 1050) |
| Indian Rupee | `INR` | 2 | 100 (₹10.50 $\rightarrow 1050) |
| Japanese Yen | `JPY` | 0 | 1 (¥1050 $\rightarrow 1050) |
| Kuwaiti Dinar | `KWD` | 3 | 1000 (10.500 KD $\rightarrow 10500) |

## 3. Zero-Loss Proportional Distribution
When dividing payments across multiple parties (e.g. platform fee, provider payout, regional tax, affiliate share):
$$\sum \text{Allocations} = \text{Original Amount}$$
`CurrencyMathService.distributeProportions()` calculates integer base shares and allocates remainder cents one-by-one to prevent a single cent from disappearing.

## 4. Currency Conversion
- Converts minor units of source currency to major units.
- Multiplies by verified exchange rate from `ExchangeRateRecord` or cache.
- Formats into target currency's minor units using Banker's Rounding (`HALF_EVEN`).
