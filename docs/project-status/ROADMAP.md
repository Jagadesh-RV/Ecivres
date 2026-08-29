# Development Roadmap

Based strictly on the verified, current state of the repository, the following roadmap dictates the immediate sequence of development tasks.

## 🔴 MUST DO (Immediate Priority)

These tasks block foundational functionality or present architectural flaws.

1. **Fix Registration Role Mapping:**
   - Update `AuthService.register()` to explicitly query the `Role` table for the "CUSTOMER" role and attach it to the new `User` via the `UserRole` joining table. Currently, new users have no role.
2. **Implement the Services API:**
   - Write the CRUD operations in `ServicesService` to allow `PROVIDER` users to create, update, and delete service listings, and `CUSTOMER` users to query them.
3. **Implement the Bookings API:**
   - Create the state machine logic in `BookingsService` to transition `BookingStatus` from `PENDING` -> `CONFIRMED` -> `COMPLETED`.

## 🟡 SHOULD DO (Short-Term Priority)

These tasks enhance the user experience and ensure code stability.

1. **Mobile Secure Storage:**
   - Replace `AsyncStorage` with `expo-secure-store` to encrypt the JWT access and refresh tokens at rest on the user's physical device.
2. **Flesh out Unit Tests:**
   - Replace the `it.todo` placeholders in `auth.service.spec.ts` with actual mocked tests using Jest.
3. **Flesh out Mobile UI:**
   - Implement the `ProviderDashboard` to show a list of their active services and pending booking requests.

## 🔵 LATER (Long-Term Goals)

These features are scaffolded but are not critical for an MVP.

1. **Payments Integration:**
   - Connect the scaffolded `PaymentsModule` to Stripe or a similar gateway.
2. **Reviews System:**
   - Allow customers to leave 1-5 star ratings on completed bookings.
3. **Admin Dashboard:**
   - Build out the `/admin` endpoints to allow moderation of categories and users.
