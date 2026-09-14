# High Traffic & DDoS Surge Mitigation Procedure

## Immediate Countermeasures

1. **Activate AWS WAF Emergency Rate Limiting**:
   - Set WAF IP Rate Limit rule to 500 requests / 5 minutes.
2. **Enable Aggressive Edge Caching on CloudFront**:
   - Override Cache-Control headers to `public, max-age=300`.
3. **Scale EKS Worker & API Pods**:
   - `kubectl scale deployment ecivres-api --replicas=30 -n ecivres-prod`
   - `kubectl scale deployment ecivres-worker --replicas=20 -n ecivres-prod`
4. **Enable Database Read Replica Load Shedding**:
   - Direct all GET traffic exclusively to read replicas.
