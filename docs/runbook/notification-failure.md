# Operational Runbook — WhatsApp & Push Notification Failure

## Symptoms
- Drop in WhatsApp booking confirmations or FCM delivery rate.

## Mitigation Steps
1. Verify Meta WhatsApp API token validity & template status.
2. Fallback to SMS notification channel if WhatsApp API fails.
