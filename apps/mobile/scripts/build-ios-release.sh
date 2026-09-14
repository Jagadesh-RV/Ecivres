#!/usr/bin/env bash
set -eo pipefail

echo "Building iOS Production Release Archive & TestFlight Upload..."
cd "$(dirname "$0")/.."

bundle exec fastlane ios beta

echo "SUCCESS: iOS release archive uploaded to TestFlight."
