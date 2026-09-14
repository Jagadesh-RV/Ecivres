# CloudFront Edge Caching & Invalidations

## Strategy Overview

EcivreS uses Amazon CloudFront backed by S3 for low-latency distribution of static assets, portfolio images, and generated invoices.

### Cache Policy

1. **Static Assets (`/assets/*`, `/images/*`)**
   - Cache-Control: `public, max-age=31536000, immutable`
   - Edge TTL: 365 Days
2. **Dynamic User Uploads (`/portfolios/*`, `/avatars/*`)**
   - Cache-Control: `public, max-age=86400, s-maxage=604800`
   - Edge TTL: 7 Days
3. **Private Invoices (`/invoices/*`)**
   - Access restricted via Signed Cookies / Signed URLs.
   - Cache-Control: `private, no-cache, no-store`

## Programmatic Cache Invalidation

When a provider updates portfolio media, invalidate CloudFront cache paths using AWS SDK:

```ts
await cloudfront.createInvalidation({
  DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  InvalidationBatch: {
    CallerReference: `inv_${Date.now()}`,
    Paths: { Quantity: 1, Items: ['/portfolios/provider-123/*'] }
  }
});
```
