# MFA & Risk-Based Adaptive Security Architecture

## Multi-Factor Authentication (MFA)
EcivreS enforces TOTP (Time-based One-Time Password) MFA and WebAuthn Passkeys for all provider and administrative accounts.

```mermaid
sequenceDiagram
    participant User
    participant Gateway
    participant RiskEngine
    participant MFA
    User->>Gateway: POST /auth/login (email, password)
    Gateway->>RiskEngine: Analyze IP, UserAgent, Device
    alt Risk Score > 40
        RiskEngine-->>Gateway: Risk = HIGH / MEDIUM (MFA Required)
        Gateway-->>User: 401 MFA Challenge Required
        User->>MFA: POST /auth/mfa/verify (totpCode)
        MFA-->>User: 200 OK (Issued JWT + Device Session)
    else Risk Score < 40
        Gateway-->>User: 200 OK (Issued JWT + Device Session)
    end
```

## Active Device Session Management
- Users can view all logged-in devices (`GET /security/sessions`).
- Remote session revocation (`DELETE /security/sessions/:id`).
- Immutable administrative audit logs for all security-sensitive actions.
