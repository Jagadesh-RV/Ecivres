# Phase 20 API Reference: Governance & Compliance

Base Route: `/api/v1/governance`

### 1. Policy Governance Endpoints
- `POST /policies` — Create versioned policy in `DRAFT` status (`CreatePolicyDto`).
- `POST /policies/submit` — Advance policy from `DRAFT` to `REVIEW` (`policyId`, `authorId`).
- `POST /policies/approve` — Approve policy with separation of duty verification (`ApprovePolicyDto`).
- `POST /policies/activate` — Activate approved policy and retire existing version (`ActivatePolicyDto`).
- `POST /policies/rollback` — Instant versioned rollback to a previous version (`RollbackPolicyDto`).
- `GET /policies/:id` — Retrieve policy record by ID.

### 2. Immutable Audit Trail Endpoints
- `POST /audit/record` — Append a tamper-evident audit record to the cryptographic hash chain (`RecordAuditEventDto`).
- `GET /audit/verify` — Verify cryptographic integrity of the hash chain across all entries or scoped to a tenant.
- `GET /audit/history` — Query filtered audit history by `targetResource` and `targetId`.

### 3. Enterprise Organization Endpoints
- `POST /enterprises` — Register an enterprise organization (`CreateEnterpriseOrgDto`).
- `POST /enterprises/members` — Add a scoped member (`AddOrgMemberDto`).
- `GET /enterprises/:id` — Get enterprise organization details and metadata.

### 4. Data Privacy Lifecycle Endpoints
- `POST /privacy/requests` — Submit a DSAR export, deletion, or anonymization request (`CreatePrivacyRequestDto`).
- `POST /privacy/requests/process` — Approve/process privacy request (`ProcessPrivacyRequestDto`).
- `GET /privacy/export/:userId` — Retrieve user data portability bundle.

### 5. Autonomous Decision Governance Endpoints
- `POST /autonomy/govern` — Apply human operator decision determination (`GovernDecisionActionDto`: `APPROVED`, `REJECTED`, `OVERRIDDEN`).
- `GET /autonomy/:decisionId` — Retrieve governance determination for a decision ID.
