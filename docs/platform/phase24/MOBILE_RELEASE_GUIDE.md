# EcivreS Platform — Mobile Application Release Guide (Expo / React Native)

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Mobile Architecture & Build Variants

The EcivreS mobile client is built on **React Native / Expo** located in `apps/mobile/`.

### Supported Build Profiles (`eas.json`):
- `development`: Debug build for local simulators with Metro bundler.
- `preview`: Internal staging build for QA testing via Expo TestFlight / APK distribution.
- `production`: Optimized, stripped release binary (Android AAB / iOS IPA) for store submission.

---

## 2. Secure Signing Key Management

> [!CAUTION]
> Keystores, signing certificates, and Google Play API credentials must never be committed to git.

- **Android Signing:**
  Managed via **Expo Application Services (EAS) Credentials** or an encrypted AWS Secrets Manager secret (`ecivres/mobile/android-keystore`).
- **Environment API URL:**
  Injected at build time via `MOBILE_API_URL` environment secret, pointing to `https://api.ecivres.com/api/v1`.

---

## 3. Release Build Command

```bash
# Navigate to mobile app directory
cd apps/mobile

# Trigger optimized Android App Bundle (AAB) build
pnpm exec eas build --platform android --profile production

# Trigger iOS release build
pnpm exec eas build --platform ios --profile production
```
