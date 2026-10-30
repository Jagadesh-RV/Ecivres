# Phase 21 Security & Privacy Review

## 1. Threat Modeling & Safeguards

| Threat Vector | Risk Level | Architectural Mitigation | Status |
|---|---|---|:---:|
| **Webhook Replay Attacks** | HIGH | 5-minute clock-skew check + unique nonce/idempotency keys | **VERIFIED** |
| **Timing Attacks on Signatures** | HIGH | Constant-time `crypto.timingSafeEqual` signature comparisons | **VERIFIED** |
| **Plaintext Credential Exposure** | CRITICAL | Plaintext API keys exposed once on generation; SHA-256 hashes stored | **VERIFIED** |
| **Cross-Tenant Partner API Access** | CRITICAL | Server-enforced `PartnerAuthGuard` checks `organizationId` matching | **VERIFIED** |
| **DDoS on Integration Endpoints** | HIGH | Sliding-window per-partner rate limiting returning HTTP 429 | **VERIFIED** |
| **LLM Model Leakage via Diagnostics** | MEDIUM | `sanitizeEvidencePayload` scrubs prompts, instructions, and weights | **VERIFIED** |
| **Cent-Loss Accounting Inaccuracies**| HIGH | Integer minor-unit math with remainder redistribution algorithms | **VERIFIED** |

## 2. Privacy & Data Minimization
- Outbound partner webhooks dispatch strictly necessary booking metadata.
- PII is masked or omitted in partner event payloads unless explicit bilateral consent is established.
