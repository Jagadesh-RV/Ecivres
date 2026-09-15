# Zero Trust Security 2.0 Specification

## Core Architecture

EcivreS Zero Trust 2.0 enforces FIDO2 / WebAuthn Passkeys alongside risk-based device fingerprinting for continuous authentication.

```
Client Auth Request → Passkey WebAuthn Signature Check
                              ↓
              Device Fingerprint Trust Evaluation
                              ↓
          Score >= 70 ? Allow Access : Force MFA Step-Up
```

### Components

1. **PasskeyService**: FIDO2 WebAuthn registration options and cryptographic signature verification.
2. **DeviceTrustService**: Risk-based device fingerprinting assigning trust scores (0-100) and triggering MFA step-up authentication when necessary.
