# Relationships and Seeding

## Database Seeding
Because the application relies heavily on Role-Based Access Control (RBAC), the database cannot function purely empty. It requires foundational data (Roles) to be present before users can register or navigate the application.

This process is handled by the Prisma seed script located at `apps/api/prisma/seed.ts`.

### Running the Seed
```bash
pnpm --filter api exec prisma db seed
```

### Seeded Data
The script creates the following core roles:
1. **`CUSTOMER`**: The default role assigned to users who register via the mobile application.
2. **`PROVIDER`**: A role indicating the user can list services in the marketplace.
3. **`ADMIN`**: A superuser role with widespread permissions.

*Note: The actual permissions mapped to these roles (via `RolePermission`) are currently minimally defined and will need expansion as the Service and Booking modules are implemented.*

## Lifecycle Implications
If the database schema is reset (e.g., via `prisma migrate reset` or wiping the Docker volumes), **the seed command must be run immediately afterward**. 

Failure to run the seed script results in an empty `Role` table, which in turn causes the `AuthService.register` method to crash when it attempts to assign the default `CUSTOMER` role to new users.
