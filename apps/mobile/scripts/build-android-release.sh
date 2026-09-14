#!/usr/bin/env bash
set -eo pipefail

echo "Building Android Production Release AAB Bundle..."
cd "$(dirname "$0")/.."

npx react-native build-android --mode=release

echo "SUCCESS: Android App Bundle generated at android/app/build/outputs/bundle/release/app-release.aab"
