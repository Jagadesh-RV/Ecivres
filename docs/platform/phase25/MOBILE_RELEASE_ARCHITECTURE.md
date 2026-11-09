# EcivreS Platform — Mobile Release Architecture & Pipeline Guide

## Executive Summary & Architecture Clarification

In previous documentation iterations, references to Expo Application Services (EAS) were erroneously introduced.

**Repository Audit Fact:**
The EcivreS mobile application (`apps/mobile/`) is **100% Bare React Native (version 0.87.0)**.
- **Expo Packages**: None. There are no Expo packages, dependencies, or plugins in `package.json`.
- **Native Directories**: `android/` and `ios/` are fully committed native projects containing Gradle build files, Kotlin source, CocoaPods specs, and Fastlane automation scripts.

---

## 1. Verified Mobile Technology Stack

- **Framework**: React Native `0.87.0`
- **React**: React `19.2.3`
- **Navigation**: React Navigation v7 (`@react-navigation/native`, `@react-navigation/native-stack`)
- **State & Forms**: Zustand `5.0.14`, React Hook Form `7.85.0`, Zod `3.25.76`
- **Secure Token Storage**: `react-native-keychain` `10.0.0` (Android Keystore / iOS Keychain)
- **Local Cache**: `@react-native-async-storage/async-storage` `3.1.1`
- **Real-Time Client**: `socket.io-client` `4.8.3`
- **Build CLI**: `@react-native-community/cli` `20.2.0`

---

## 2. Native Android Build Pipeline (Gradle)

Android releases are compiled using the native Gradle wrapper in `apps/mobile/android`:

### 2.1 Release APK (Testing / Side-loading)
```bash
cd apps/mobile/android
./gradlew assembleRelease
# Output: apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

### 2.2 Release Android App Bundle (AAB for Google Play)
```bash
cd apps/mobile/android
./gradlew bundleRelease
# Output: apps/mobile/android/app/build/outputs/bundle/release/app-release.aab
```

### 2.3 Signing Configuration (`android/app/build.gradle`)
Production builds are signed using environment variables injected by CI/CD:
```groovy
signingConfigs {
    release {
        if (System.getenv("ANDROID_KEYSTORE_PATH")) {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
}
```
> **Security Mandate**: Keystore binaries (`.keystore`, `.jks`) and signing passwords are NEVER committed to version control. They are stored securely in GitHub Actions Encrypted Secrets.

---

## 3. Fastlane Automation (`apps/mobile/fastlane`)

Fastlane manages automated deployment lanes:
- `fastlane android beta`: Builds AAB and uploads to Google Play Internal Testing track.
- `fastlane android promote_to_production`: Promotes validated internal release to production.
- `fastlane ios beta`: Builds IPA with match certificates and uploads to Apple TestFlight.
