# Public API & Webhooks Developer Platform

## API Key Authentication
Third-party applications authenticate using HTTP Bearer headers:
`Authorization: Bearer ecv_live_xxxx...`

## Webhook Events Matrix
| Event Name | Description | Payload Signature |
| :--- | :--- | :--- |
| `booking.created` | Emitted when a customer confirms a booking | `X-Ecivres-Signature: sha256=...` |
| `booking.completed` | Emitted when a provider marks a job completed | `X-Ecivres-Signature: sha256=...` |
| `review.posted` | Emitted when a review is published | `X-Ecivres-Signature: sha256=...` |
