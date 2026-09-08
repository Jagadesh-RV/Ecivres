# WebSocket Reconnect & Connection Resiliency Policy

## Reconnection Settings
- **Reconnection Attempt Limit**: Infinite (`Infinity`)
- **Initial Reconnection Delay**: 1000ms
- **Maximum Reconnection Delay**: 5000ms
- **Randomization Factor (Jitter)**: 0.5

## Client Room Re-subscription
Upon reconnection (`connect` event), client SDKs automatically re-send `joinUserRoom` and `joinBookingRoom` messages to ensure seamless message delivery after temporary network loss.
