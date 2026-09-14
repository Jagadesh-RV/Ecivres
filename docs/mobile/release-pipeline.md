# Mobile Production Release Pipeline (Android & iOS)

## Automated Release Workflow
Mobile app builds are automated via Fastlane and GitHub Actions.

```mermaid
graph TD
    Code[React Native Bare App] --> Fastlane[Fastlane CI Automation]
    Fastlane --> AndroidBuild[Gradle Release AAB]
    Fastlane --> iOSBuild[Xcode AppStore IPA]
    AndroidBuild --> PlayStore[Google Play Console Internal Track]
    iOSBuild --> TestFlight[Apple TestFlight]
```

## Release Commands
- **Android Google Play Store Internal Deployment**: `cd apps/mobile && bundle exec fastlane android deploy_play_store`
- **iOS Apple TestFlight Deployment**: `cd apps/mobile && bundle exec fastlane ios deploy_testflight`
