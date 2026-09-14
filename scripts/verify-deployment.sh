#!/usr/bin/env bash
set -eo pipefail

ENDPOINT=${1:-"http://localhost:3000"}

echo "Verifying deployment readiness at ${ENDPOINT}..."

READINESS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${ENDPOINT}/health/readiness" || true)
if [ "$READINESS_STATUS" -ne 200 ]; then
  echo "CRITICAL: Health check failed with status ${READINESS_STATUS}"
  exit 1
fi

echo "SUCCESS: API deployment verified healthy (HTTP 200 OK)."
