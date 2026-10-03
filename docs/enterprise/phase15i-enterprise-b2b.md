# Phase 15I — Enterprise B2B & Procurement Engine

## Enterprise Features
1. **Organization Hierarchy**: Parent-child corporate account structures supporting multi-location facilities management.
2. **Negotiated Rate Cards**: Category-level percentage discount structures customized per enterprise contract.
3. **Purchase Order & Net Terms Invoicing**:
   - Automated approval routing for PO invoices exceeding organizational spending thresholds.
   - Configurable payment terms (`Net 15`, `Net 30`, `Net 60`).

## APIs
- `POST /enterprise-b2b/org`: Register enterprise organization.
- `POST /enterprise-b2b/rate-card`: Configure custom category discount.
- `GET /enterprise-b2b/price-quote?orgId=org_1&categoryId=cat_hvac&standardPrice=200`: Calculate negotiated price quote.
- `POST /enterprise-b2b/po-invoice`: Submit purchase order invoice.
