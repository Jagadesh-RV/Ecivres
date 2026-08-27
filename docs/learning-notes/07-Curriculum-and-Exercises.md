# EcivreS: Chunk 7 - Curriculum & Mastery

This final document covers **Phase 21 (Curriculum)**, **Phase 22 (Interview Prep)**, **Phase 23 (Exercises)**, **Phase 24 (AI Dependency Removal)**, and **Phase 25 (Final Structure)**.

---

## Phase 21 — Learning Curriculum Roadmap

To master this codebase from zero, study the technologies in this exact order, using EcivreS files as your textbook:

1.  **TypeScript Fundamentals:** Understand interfaces and types. (Read `packages/types/` if present, or DTOs).
2.  **React Native Basics:** Understand component structure. (Read `apps/mobile/src/screens/auth/WelcomeScreen.tsx`).
3.  **React Navigation:** Understand how screens stack. (Read `AppNavigator.tsx`).
4.  **Zustand (State):** Understand how global state prevents prop drilling. (Read `authStore.ts`).
5.  **HTTP & Axios:** Understand REST requests. (Read `client.ts` and `interceptors.ts`).
6.  **NestJS Architecture:** Understand Modules, Controllers, Services. (Read `app.module.ts`, `auth.controller.ts`, `auth.service.ts`).
7.  **PostgreSQL & Prisma:** Understand relational databases. (Read `schema.prisma`).
8.  **JWT Authentication:** Understand access vs. refresh tokens. (Read `auth.service.ts` again).
9.  **RBAC Authorization:** Understand Guards. (Read `roles.guard.ts`).

---

## Phase 22 — Interview Preparation

If you claim to have built EcivreS on your resume, a Senior Engineer will ask you these questions. Practice answering them out loud.

### React Native & Frontend
1.  *Question:* Why did you choose React Native CLI over Expo for EcivreS?
    *   *Answer:* "We needed deep native integration for secure token storage via React Native Keychain, and bare CLI gave us more control over the Android build pipeline (Gradle)."
2.  *Question:* How do you prevent the user from seeing a flash of the login screen if they are already authenticated?
    *   *Answer:* "In `AppNavigator.tsx`, I evaluate `isLoading` from Zustand. Until `restoreSession()` finishes checking Keychain, I render an `ActivityIndicator` (spinner)."
3.  *Question:* What happens when a user's token expires while they are using the app?
    *   *Answer:* "My Axios interceptor catches the 401 response, pauses all outgoing requests using a `failedQueue`, hits the `/auth/refresh` endpoint with the refresh token, stores the new tokens, and then replays the failed requests."

### NestJS & Backend
4.  *Question:* What is the purpose of a DTO in NestJS, and how is it validated?
    *   *Answer:* "A Data Transfer Object defines the expected shape of an incoming request. I use `class-validator` decorators on the class properties, and a global `ValidationPipe` in `main.ts` intercepts and validates the request before it hits my controller."
5.  *Question:* Explain how your Role-Based Access Control (RBAC) works.
    *   *Answer:* "I created a custom `@Roles()` decorator to tag endpoints. A `RolesGuard` intercepts the request, grabs the `user.id` from the JWT payload, queries Prisma for the user's nested roles, and compares them against the decorator."
6.  *Question:* How did you handle N+1 query problems in Prisma when fetching roles and permissions?
    *   *Answer:* "Prisma avoids N+1 automatically when using the `include` keyword, which translates into SQL `JOIN` statements rather than multiple separate queries."

---

## Phase 23 — Practical Exercises

To prove your mastery, implement the following features manually in the codebase without using an AI auto-coder.

1.  **Add a Permission:** Open `schema.prisma` and add a new permission to the seeder (or manually in Prisma Studio). Go to `ServicesController` and change `@Roles('PROVIDER')` to `@Permissions('CREATE_SERVICE')`. Update `permissions.guard.ts` to ensure it works.
2.  **Add a Profile Field:** Add an `avatarUrl` string to `CustomerProfile` in `schema.prisma`. Run `pnpm db:migrate`. Update the `CustomerProfileDto` in NestJS. Update the React Native UI to display it.
3.  **Implement the Bookings Endpoint:** The `BookingsController` is currently empty. Write a `@Post()` endpoint that takes a `serviceId` and a `scheduledAt` date, validates it, and saves a `Booking` to the database using `BookingsService`. Ensure only `CUSTOMER` roles can hit this endpoint.

---

## Phase 24 — AI Dependency Removal Framework

Moving forward, when you want to build a new feature (e.g., "Implement Bookings"), **do not** prompt an AI with "Write the bookings feature for me".

Instead, follow this framework:
1.  **Understand:** Write down the database changes required (e.g., "I need a Booking table").
2.  **Design:** Write down the API route required (`POST /api/v1/bookings`) and the DTO shape.
3.  **Predict:** List the files you will need to touch (`schema.prisma`, `bookings.controller.ts`, `bookings.service.ts`, `api/client.ts`, `BookingsScreen.tsx`).
4.  **Implement:** Try to write the NestJS Controller by looking at how the `AuthController` was written. Copy patterns, don't copy AI code.
5.  **Debug:** If it fails, read the terminal error. Trace the stack trace. Use Phase 19 (Debugging Manual).
6.  **Explain:** Once it works, explain to yourself *why* it works.

---

## Phase 25 — Final Documentation Structure

Your learning notes are now complete. The repository now contains a complete engineering textbook in `docs/learning-notes/`:

1.  `01-Discovery-and-Architecture.md`: Repo structure and macro architecture.
2.  `02-Deep-Dives.md`: Mobile and Backend internals, plus Prisma/Postgres theory.
3.  `03-Auth-and-Authorization.md`: Security, JWT, and RBAC deep dive.
4.  `04-API-and-Data-Flows.md`: The complete actual API reference and request tracing.
5.  `05-DevOps-and-Security.md`: Build systems, environment variables, and security audits.
6.  `06-Debugging-and-Code-Reading.md`: Troubleshooting manuals and specific code lessons.
7.  `07-Curriculum-and-Exercises.md`: This file.

> **Final Note from Senior Architect:** You now have the knowledge to build, maintain, and scale EcivreS. Trust the architecture, read the errors, and write code deliberately.
