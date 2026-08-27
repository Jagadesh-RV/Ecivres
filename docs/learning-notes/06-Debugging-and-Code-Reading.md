# EcivreS: Chunk 6 - Debugging & Code Reading

This document covers **Phase 19 (Debugging Manual)** and **Phase 20 (Code Reading Lessons)**.

---

## Phase 19 — Debugging Manual

When things break, follow these exact traces based on the EcivreS architecture.

### Scenario 1: "I get a 401 Unauthorized constantly on the mobile app."
*   **The Culprit:** The Access Token is expired, and the Refresh Token rotation failed.
*   **The Trace:**
    1.  Open `apps/mobile/src/services/api/interceptors.ts`.
    2.  Check the `errorInterceptor`. Is `isRefreshing` getting stuck?
    3.  Check the backend logs (`pnpm docker:logs` or backend terminal). Did the `/auth/refresh` endpoint throw an error?
    4.  **Fix:** The quickest dev fix is to clear the mobile Keychain. In `authStore.ts`, call `logout()`. On Android emulator, you can also wipe app data from the OS settings.

### Scenario 2: "I changed a NestJS DTO, but the mobile app still succeeds with bad data!"
*   **The Culprit:** Metro Bundler cache or missing ValidationPipe.
*   **The Trace:**
    1.  Check `apps/api/src/main.ts`. Is `app.useGlobalPipes(new ValidationPipe())` present?
    2.  If yes, the mobile app might be sending old cached data.
    3.  **Fix:** Restart Metro with `pnpm --filter mobile start --reset-cache`.

### Scenario 3: "Prisma complains about 'Foreign key constraint failed on the field: `userId`'"
*   **The Culprit:** You are trying to create a `CustomerProfile` or `ProviderProfile` for a `User` ID that does not exist in the database, OR you deleted the User but the cascade didn't work.
*   **The Trace:**
    1.  Open Prisma Studio: `pnpm --filter api exec prisma studio`
    2.  Check the `User` table. Does the ID exist?
    3.  Check `schema.prisma`. Ensure `onDelete: Cascade` is applied to the relation.

### Scenario 4: "Android build fails with 'Task :app:compileDebugJavaWithJavac FAILED'"
*   **The Culprit:** A Gradle mismatch or native module cache issue.
*   **The Fix:**
    ```bash
    cd apps/mobile/android
    ./gradlew clean
    cd ../../..
    pnpm --filter mobile android
    ```

---

## Phase 20 — Code Reading Lessons

To remove reliance on AI, you must understand *why* specific lines of code exist.

### Lesson 1: The Axios Refresh Interceptor
File: `apps/mobile/src/services/api/interceptors.ts`

```typescript
if (error.response?.status === 401 && !originalRequest._retry) {
```
*   `error.response?.status === 401`: The backend rejected our token.
*   `!originalRequest._retry`: We add a custom `_retry` flag to the request object. If this is true, it means we *already* tried to refresh the token and failed. If we don't check this, the app will enter an infinite loop of 401s, crashing the phone.

```typescript
if (isRefreshing) {
  return new Promise(function(resolve, reject) {
    failedQueue.push({ resolve, reject });
  }).then(token => {
```
*   **The Problem:** What if the app fires 5 API calls at the same exact time, and the token is expired? All 5 will get a 401. All 5 will try to refresh the token simultaneously, causing race conditions in the database.
*   **The Solution (`isRefreshing` & `failedQueue`):** The first request sets `isRefreshing = true`. The other 4 requests hit this `if` block. They are put into a `failedQueue` (suspended in memory as pending Promises). Once the first request gets the new token, it loops through the queue and resolves all 4 waiting requests with the new token.

### Lesson 2: NestJS Data Transfer Objects (DTOs)
File: `apps/api/src/modules/auth/dto/login.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```
*   **Why use Classes instead of Interfaces?** TypeScript interfaces disappear at runtime (they are stripped during compilation to JS). Classes persist in JavaScript.
*   **The Decorators (`@IsEmail()`):** Because the class exists at runtime, NestJS's `ValidationPipe` uses the `class-validator` package to read these decorators. It runs regex checks on the incoming JSON.
*   **The Result:** You never have to write `if (!req.body.email.includes('@')) return res.status(400)` in your Controllers ever again.

---

*This concludes Chunk 6. Next, we finalize the knowledge base with Curriculum, Interview Questions, and Exercises in Chunk 7.*
