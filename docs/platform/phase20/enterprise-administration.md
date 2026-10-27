# Enterprise Organization Administration & Tenancy

## 1. Overview
Enterprise customers operate as discrete tenant units within EcivreS. They require hierarchical administration, delegated access control, and strict cross-tenant data isolation.

## 2. Organization Roles & Privileges
| Role | Description | Allowed Actions |
|---|---|---|
| `OWNER` | Organization creator / legal owner | All actions, billing, member invites, org settings |
| `ADMIN` | Delegated tenant administrator | Member management, policy oversight, booking approvals |
| `BILLING` | Finance & accounting manager | Invoices, payment ledgers, tax documentation |
| `MEMBER` | Standard enterprise staff / consumer | View catalog, book services, submit support requests |

## 3. Cross-Tenant Isolation
Server-side tenant checking is enforced on all organization queries:
```typescript
const member = members.find((m) => m.userId === userId);
if (!member) {
  this.logger.warn(`CROSS-TENANT ISOLATION BREACH ATTEMPT: User ${userId} attempted access to Org ${orgId}`);
  throw new ForbiddenException(`Cross-tenant access denied. You are not a member of organization '${orgId}'.`);
}
```
Cross-tenant leakage across enterprise boundaries is structurally prevented.
