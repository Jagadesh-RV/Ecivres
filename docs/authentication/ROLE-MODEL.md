# EcivreS Role Model

## Final EcivreS role model pending business confirmation.

At present, only 3 roles are explicitly confirmed by the system seed:
- `ADMIN`: Administrator
- `CUSTOMER`: End user who books services
- `PROVIDER`: Service provider who offers services

There are 8 missing roles that are pending business definition.

## Architecture

The system uses a combination of Role-Based Access Control (RBAC) and granular Permissions.
- **RolesGuard**: Checks if the user is assigned a specific role (e.g., `@Roles('ADMIN')`).
- **PermissionsGuard**: Checks if the user has a specific permission through their assigned roles (e.g., `@Permissions('create:booking')`).

## Assignment Rules
- A user can select to become a `CUSTOMER` or a `PROVIDER` during the profile onboarding phase on the mobile app.
- Privileged roles (e.g. `ADMIN`) must be assigned by another `ADMIN` through an administrative interface (not yet implemented).
- `UserRole` handles the many-to-many relationship between Users and Roles.

## IDOR Protection
Authorization is performed server-side using the `userId` from the JWT token, accessed via the `@CurrentUser()` decorator. Clients cannot dictate their identity or roles.
