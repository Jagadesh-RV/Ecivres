# White-Label Marketplace Architecture

## Overview
The EcivreS White-Label Platform allows multi-tenant enterprise partners to launch custom-branded service marketplaces with dedicated domains, custom CSS theme tokens, custom email templates, and selective feature toggles.

```mermaid
graph TD
    PartnerClient[Partner Web / Mobile App] --> EdgeDNS[Custom Domain: services.partner.com]
    EdgeDNS --> TenantResolver[White-Label Tenant Middleware]
    TenantResolver --> ThemeInjector[CSS Theme & Logo Injector]
    TenantResolver --> FeatureGateway[Tenant Feature Flags]
    FeatureGateway --> CoreAPI[EcivreS Core API Platform]
```

## Feature Toggle Matrix
- `enableArPreview`: Toggles 3D AR spatial room preview.
- `enableSplitPayments`: Enables multi-party bill splitting.
- `enableGamification`: Enables customer points, streaks, and VIP badge tiers.
