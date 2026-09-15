# Provider Fleet Telemetry & Geo-Fence Tracking

## Overview
The Smart Logistics Engine captures real-time GPS telemetry from active providers, performing automated velocity filtering, battery degradation tracking, and route anomaly detection.

## Anomaly Detection Rules
- **Speeding Violation**: If reported speed > 160 km/h, flag safety anomaly and alert dispatch operations.
- **Critical Battery Alert**: If battery level < 10%, request provider plug-in or re-assign upcoming dispatch.

## Telemetry Endpoint
- **POST** `/api/v1/logistics/telemetry`
  ```json
  {
    "providerId": "prov_100",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "speedKmh": 45,
    "batteryLevel": 88
  }
  ```
