# Current Project Status

This matrix identifies the precise, actual status of the EcivreS codebase by cross-referencing requirements with the active repository implementation.

| Feature Area | Component | Status | Evidence | Notes |
|--------------|-----------|--------|----------|-------|
| **Core** | Monorepo Setup | 🟢 COMPLETE | `pnpm-workspace.yaml` | Workspaces configured for API/Mobile. |
| **DevOps** | Database Docker | 🟢 COMPLETE | `docker-compose.yml` | PostgreSQL running on `5433`. |
| **Backend** | Prisma ORM | 🟢 COMPLETE | `schema.prisma` | Full schema defined and migrated. |
| **Backend** | Roles Seeding | 🟢 COMPLETE | `seed.ts` | Default roles (ADMIN, CUSTOMER, PROVIDER) seed successfully. |
| **Auth** | Password Hashing | 🟢 COMPLETE | `auth.service.ts` | Uses bcrypt salt round 10. |
| **Auth** | Login / Register API | 🟢 COMPLETE | `auth.controller.ts` | Functional endpoints returning JWTs. |
| **Auth** | Refresh Token Logic | 🟢 COMPLETE | `auth.service.ts` | Token rotation and revocation on logout working. |
| **Auth** | `JwtAuthGuard` | 🟢 COMPLETE | `jwt-auth.guard.ts` | Successfully protects endpoints. |
| **Auth** | `RolesGuard` | 🟢 COMPLETE | `roles.guard.ts` | Blocks access based on JWT payload roles. |
| **Auth** | Registration Role | 🟡 PARTIAL | `auth.service.ts` | Creates user and `CustomerProfile`, but currently fails to link the user to the `UserRole` mapping table. |
| **Mobile** | Zustand Stores | 🟢 COMPLETE | `authStore.ts` | Accurately hydrates session from AsyncStorage. |
| **Mobile** | Axios Interceptors | 🟢 COMPLETE | `interceptors.ts` | Injects JWTs and catches `401` for token refresh. |
| **Mobile** | Navigation Guards | 🟢 COMPLETE | `AppNavigator.tsx` | Routes user based on authentication and profile state. |
| **Mobile** | Login/Register UI | 🟢 COMPLETE | `LoginScreen.tsx` | UI is functional and communicates with API. |
| **Marketplace** | Services API | 🔴 SCAFFOLDED | `services/` | Controller generated, no business logic implemented. |
| **Marketplace** | Bookings API | 🔴 SCAFFOLDED | `bookings/` | Controller generated, no business logic implemented. |
| **Marketplace** | Payments API | 🔴 SCAFFOLDED | `payments/` | Controller generated, no business logic implemented. |
| **Testing** | Backend Unit Tests | 🔴 SCAFFOLDED | `*.spec.ts` | Files exist but contain `it.todo`. |
