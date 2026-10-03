# Phase 15J — Ecosystem Platform & Whitelabel Hub Architecture

## Multi-Tenant Whitelabel Capabilities
1. **Custom Domain Routing**: Resolve incoming HTTP Host headers dynamically to partner tenants (e.g. `services.city.gov`, `home.insurancepartner.com`).
2. **Brand Theme Injection**: Custom primary/secondary color schemes, partner logos, favicons, and custom CSS asset overrides.
3. **Revenue Share Split Engine**:
   - Gross Marketplace Commission = $\text{GMV} \times \frac{\text{Commission \%}}{100}$
   - Partner Tenant Payout = $\text{Gross Commission} \times \frac{\text{Tenant Share \%}}{100}$
   - Net EcivreS Revenue = $\text{Gross Commission} - \text{Partner Tenant Payout}$

## APIs
- `POST /whitelabel/tenant`: Register partner tenant.
- `GET /whitelabel/lookup-domain?domain=services.city.gov`: Lookup tenant profile.
- `POST /whitelabel/theme`: Configure custom CSS and branding tokens.
- `GET /whitelabel/theme?tenantId=wt_100`: Fetch theme configuration.
- `GET /whitelabel/revenue-share?gmv=10000&commission=15&tenantShare=10`: Calculate revenue share split.
