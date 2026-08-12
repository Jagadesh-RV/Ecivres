# Role-Based Access Control (RBAC)

EcivreS uses RBAC to determine who can perform actions.
- A **User** has many **Roles**.
- A **Role** has many **Permissions**.
- Access is checked using the `@Roles()` decorator and `RolesGuard` in NestJS.
