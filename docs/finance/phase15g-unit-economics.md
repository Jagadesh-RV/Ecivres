# Phase 15G — Advanced Revenue & Unit Economics Engine

## Key Financial Indicators & Formulas
1. **GMV & Net Revenue**:
   - Gross Merchandise Value (GMV): Total monetary transaction value of bookings.
   - Net Marketplace Revenue = $\text{GMV} \times \frac{\text{Take Rate \%}}{100}$
   - Average Order Value (AOV) = $\frac{\text{GMV}}{\text{Total Orders}}$
2. **Customer Lifetime Value (LTV) & CAC**:
   - $\text{LTV} = \text{ARPU}_{\text{monthly}} \times \text{Gross Margin \%} \times \text{Lifetime Months}$
   - $\text{LTV:CAC Ratio} = \frac{\text{LTV}}{\text{CAC}}$
   - $\text{Payback Period (Months)} = \frac{\text{CAC}}{\text{Monthly Gross Profit per User}}$
3. **Margin Analysis**:
   - Gross Margin \% = $\frac{\text{Revenue} - \text{COGS}}{\text{Revenue}} \times 100$
   - Contribution Margin = $\text{Revenue} - (\text{COGS} + \text{Variable Marketing} + \text{Payment Processing})$

## APIs
- `GET /unit-economics/executive-revenue`: GMV, Net Revenue, Take Rate, AOV.
- `GET /unit-economics/ltv-cac?cac=50&arpuMonthly=30&grossMargin=80&churnRate=4`: LTV/CAC ratios.
- `GET /unit-economics/margins?revenue=100000&cogs=15000&marketing=20000&paymentProc=5000`: Margin breakdown.
