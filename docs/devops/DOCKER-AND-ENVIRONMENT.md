# Docker and Environment

The EcivreS local development environment relies heavily on Docker Compose to guarantee consistency and isolate infrastructure services from the host OS.

## Docker Architecture

The `docker-compose.yml` in the root of the repository defines three primary services:
1. **`postgres`**: The relational database used by Prisma.
   - **Important Configuration:** Port mapping is `5433:5432`. This avoids conflict with any local PostgreSQL instance running natively on Windows on port `5432`.
   - **Volumes:** Uses a named volume `postgres_data` to persist data between container restarts.
2. **`redis`**: (Available but currently unused) Intended for caching or queueing. Maps to port `6380`.
3. **`mongodb`**: (Available but currently unused) Intended for unstructured data. Maps to port `27018`.

## Environment Variables

### NestJS Backend (`apps/api/.env`)
- `DATABASE_URL`: Must point to the Docker PostgreSQL instance on port `5433` (e.g., `postgresql://postgres:postgres@localhost:5433/ecivres?schema=public`).
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Cryptographic keys used by `JwtService`.
- `PORT`: (Default `5000`) The port the NestJS API listens on.

### React Native Frontend
Currently, network addresses are hardcoded in `apps/mobile/src/services/api/client.ts` to `http://localhost:5000/api/v1`. 
*Note: This requires Android physical devices to utilize `adb reverse tcp:5000 tcp:5000` to successfully route traffic to the host computer.*
