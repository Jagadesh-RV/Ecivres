# EcivreS: Chunk 5 - DevOps, Security, and Build Systems

This document covers **Phase 13 (Android Native Layer)**, **Phase 14 (Build System)**, **Phase 15 (Command Encyclopedia)**, **Phase 16 (Environment Variables)**, **Phase 17 (Security Audit)**, and **Phase 18 (Performance Analysis)**.

---

## Phase 13 — Android Native Layer

EcivreS is a "bare" React Native app. This means we have full access to the `android/` directory.

### How React Native starts on Android
1.  **`AndroidManifest.xml`**: Located in `apps/mobile/android/app/src/main/`. This file defines the app's permissions (like internet access) and declares the `MainActivity`.
2.  **`MainActivity.java/kt`**: The native entry point. When the user taps the app icon, Android launches this Activity.
3.  **`MainApplication.java/kt`**: Initializes the React Native framework (`ReactHost` or `ReactInstanceManager`).
4.  **The Bridge**: The native layer loads the JavaScript bundle (compiled from `index.js`) into a JavaScript engine (Hermes or JSC).
5.  **Rendering**: The JS thread executes your React code, and sends asynchronous messages across the "bridge" to the native UI thread, telling it to render native Android `View` and `TextView` components.

---

## Phase 14 — Build System

There are two primary build systems operating simultaneously during development.

### 1. Metro Bundler (JavaScript)
*   **What it is:** The JavaScript bundler for React Native.
*   **What it does:** It takes all your `.tsx`, `.ts`, and `node_modules`, transpiles them using Babel, and packages them into a single massive JavaScript file (the bundle) that the Android/iOS device can execute.
*   **How it runs:** `pnpm --filter mobile start`

### 2. Gradle (Android Native)
*   **What it is:** The build automation tool for Android.
*   **What it does:** It compiles the Java/Kotlin code, processes XML resources, bundles the React Native JS bundle as an asset, and packages everything into an `.apk` or `.aab` file.
*   **How it runs:** `pnpm --filter mobile android` (which essentially runs `./gradlew installDebug` under the hood).

---

## Phase 15 — Command Encyclopedia

Here is exactly what happens when you run common commands from `COMMANDS.md`.

*   **`docker compose up -d`**
    *   Reads `docker-compose.yml`.
    *   Pulls the official PostgreSQL image and starts a container listening on port `5432`.
    *   `-d` runs it in the background (detached).
*   **`pnpm --filter api exec prisma db push`**
    *   Reads `apps/api/prisma/schema.prisma`.
    *   Connects to the database using `DATABASE_URL`.
    *   Forcefully updates the database schema to match the Prisma file without creating migration history files (used in rapid prototyping).
*   **`pnpm --filter mobile start --reset-cache`**
    *   Starts the Metro bundler.
    *   `--reset-cache` is crucial. Metro heavily caches transpiled files to save time. If a Babel configuration or environment variable changes and isn't reflecting, clearing the cache forces a full rebuild.

---

## Phase 16 — Environment Variables

Defined in `/.env`.

| Variable | Purpose | Used By | Security |
| -------- | ------- | ------- | -------- |
| `DATABASE_URL` | Prisma connection string | Backend | **HIGH**. Contains DB password. |
| `JWT_ACCESS_SECRET` | Used to sign short-lived tokens | Backend | **CRITICAL**. If leaked, anyone can forge tokens. |
| `JWT_REFRESH_SECRET` | Used to sign long-lived tokens | Backend | **CRITICAL**. |
| `CORS_ORIGINS` | Defines allowed frontend URLs | Backend | Medium. Prevents browser-based cross-origin attacks. |
| `MOBILE_API_URL` | Tells the app where to connect | Mobile | Low. Bundled into the app at compile time. |

---

## Phase 17 — Security Audit (Repository Findings)

A codebase audit reveals both excellent security practices and remaining vulnerabilities.

### Strong Security Defenses Present
1.  **JWT Refresh Token Rotation:** By deleting the old refresh token upon use (`auth.service.ts`), EcivreS protects against token theft. If an attacker steals a refresh token, it can only be used once.
2.  **Keychain Storage:** The mobile app uses `react-native-keychain` rather than `AsyncStorage` for JWTs. This encrypts the tokens in the Android Keystore/iOS Secure Enclave, protecting them from malware.
3.  **Password Hashing:** `bcrypt.hash(password, 10)` is correctly utilized, preventing raw password exposure in the database.
4.  **ValidationPipe Strictness:** `whitelist: true` and `forbidNonWhitelisted: true` in `main.ts` prevents Mass Assignment vulnerabilities (where an attacker injects `{"role": "ADMIN"}` into a registration payload).

### Vulnerabilities & Recommendations
> [!WARNING]
> **Missing Helmet (Vulnerability):** `helmet` is installed in `package.json`, but is **not applied** in `main.ts`. 
> *Fix:* Add `app.use(helmet());` to `main.ts` to automatically set secure HTTP headers (XSS protection, preventing clickjacking).
> 
> **Rate Limiting:** There is no `@nestjs/throttler` configured. The `/auth/login` route is susceptible to brute-force attacks.

---

## Phase 18 — Performance Analysis

Based on the architecture, here are the expected performance characteristics:

1.  **Prisma N+1 Queries (Risk):** 
    In `roles.guard.ts`, the code uses `include: { userRoles: { include: { role: true } } }`. Prisma translates this into an efficient JOIN, avoiding the N+1 problem. However, as the app grows, deep `include` statements can become very heavy on the database.
2.  **React Native Re-renders (Optimized):**
    By using `Zustand` instead of Redux or Context API, components only re-render when the specific piece of state they subscribe to changes, keeping the mobile UI 60fps smooth.
3.  **Database Indexing:**
    `schema.prisma` correctly uses `@unique` on `email`, `userId` (in profiles), and `bookingId`, which automatically creates B-Tree indexes in PostgreSQL, ensuring lightning-fast lookups.

---

*This concludes Chunk 5. Next, we cover Debugging and Code Reading in Chunk 6.*
