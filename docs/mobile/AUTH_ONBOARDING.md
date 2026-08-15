# Auth & Onboarding testing on Physical Android Device

When testing the EcivreS mobile app on a physical Android device, the mobile app cannot resolve `localhost` or `127.0.0.1` to reach the NestJS API running on your development PC.

## Configuration Steps

1. **Find your PC's IP Address**:
   - Open PowerShell and run `ipconfig`.
   - Note the IPv4 Address (e.g., `192.168.1.5`).

2. **Start the API**:
   - The API must listen on `0.0.0.0` to accept external connections.
   - Run `pnpm --filter api start:dev`. (NestJS defaults to binding to all interfaces if not restricted).

3. **Configure the Mobile App**:
   - The Mobile App uses `process.env.EXPO_PUBLIC_API_URL` to configure the API base URL.
   - Start Metro with the environment variable set to your IP:
     ```bash
     $env:EXPO_PUBLIC_API_URL="http://192.168.1.5:3000"
     pnpm --filter mobile start
     ```

## Onboarding Flow
- The `OnboardingScreen` uses a `FlatList` to present an interactive carousel.
- User state is tracked in `AsyncStorage` via the `has_seen_onboarding` flag.
- When `restoreSession` is called on app startup, if the user hasn't seen the onboarding, they are routed to `Onboarding`. Otherwise, they go to `Welcome`.
