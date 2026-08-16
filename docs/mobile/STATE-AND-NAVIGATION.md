# Mobile State & Navigation

## State Management (`Zustand`)
The mobile application relies heavily on `Zustand` for lightweight, global state management, specifically focused on Authentication and User Profiles.

### `authStore.ts`
Located at `apps/mobile/src/stores/authStore.ts`, this store manages:
- `user`: The current user object returned by the API.
- `isAuthenticated`: Boolean tracking the token presence.
- `isProfileComplete`: Boolean evaluating if `hasCustomerProfile` or `hasProviderProfile` is true.
- `isLoading`: Boolean used to show the Splash screen / Activity Indicator while session is hydrated.

### Session Hydration
On app launch, the `AppNavigator` calls `restoreSession()`.
1. It attempts to fetch `access_token` from `AsyncStorage`.
2. If found, it immediately makes a request to `/users/me`.
3. If successful, it populates the store and grants entry.
4. If the token is invalid or the API returns `401`, it cascades to logout and destroys the local tokens.

## Navigation Architecture

React Navigation is used to build a protected conditional routing tree.

```typescript
// Conceptual rendering in AppNavigator.tsx
if (!isAuthenticated) return <AuthNavigator />;
if (!isProfileComplete) return <ProfileSetupNavigator />;
if (user.roles.includes('PROVIDER')) return <ProviderNavigator />;
return <CustomerNavigator />;
```

### Navigators
- **`AuthNavigator`**: Contains `LoginScreen` and `RegisterScreen`. Unlocked when logged out.
- **`ProfileSetupNavigator`**: Contains screens to complete initial profile data. Unlocked when logged in but profile is empty.
- **`CustomerNavigator`**: The main app experience for buyers. Contains `CustomerDashboard`.
- **`ProviderNavigator`**: The main app experience for sellers. Contains `ProviderDashboard`.
