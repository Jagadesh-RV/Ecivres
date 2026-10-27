# Tamper-Evident Immutable-Style Audit Trail

## 1. Overview
The Audit Trail service records critical administrative, financial, governance, and autonomous operations. It provides cryptographic proof of log integrity using linear hash chaining.

## 2. Cryptographic Hash Chaining Specification
- **Genesis Hash**:
  $$H_0 = 0000000000000000000000000000000000000000000000000000000000000000$$
- **Entry Hash Calculation**:
  $$H_i = \text{SHA256}(H_{i-1} \parallel \text{actorId} \parallel \text{action} \parallel \text{targetResource} \parallel \text{targetId} \parallel \text{timestamp} \parallel \text{metadata})$$

## 3. Data Sanitization & Redaction
Before hashing or persistence, metadata is scrubbed for credentials:
- `password`
- `token`, `refreshToken`
- `secret`, `authorization`
- `apiKey`
- `creditCard`, `cardNumber`, `cvv`

Matching keys are sanitized to `[REDACTED]`.

## 4. Integrity Verification Workflow
Executing `GET /api/v1/governance/audit/verify` iterates through all stored entries:
1. Re-computes $H_i$ from payload and $H_{i-1}$.
2. Compares with stored $H_i$.
3. Checks link continuity $H_{i-1} == \text{previousHash}$.
4. If mismatch is detected, returns `isChainValid: false`, `corruptedEntryId`, and logs a critical tampering alert.
