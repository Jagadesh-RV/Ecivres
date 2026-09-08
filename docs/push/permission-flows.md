# iOS APNs & Android FCM Push Notification Permission Flows

## Android 13+ (API 33+)
- Requires explicit runtime permission `POST_NOTIFICATIONS`.
- Permission prompt presented during onboarding or first booking creation.

## iOS (APNs)
- Uses `@react-native-firebase/messaging` `requestPermission()`.
- Requests Provisional Authorization (`ALERT`, `BADGE`, `SOUND`).
