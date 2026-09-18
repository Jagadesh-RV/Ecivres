# IoT Service Automation Architecture

## Overview
The EcivreS IoT Module provides real-time MQTT gateway ingest, device heartbeat tracking, predictive maintenance anomaly detection, and automated booking dispatch.

```mermaid
graph TD
  Sensors[IoT Sensors & Appliances] -->|MQTT / TLS| Gateway[MQTT Event Gateway]
  Gateway --> Health[Device Health Tracker]
  Gateway --> Anomaly[Predictive Anomaly Engine]
  Anomaly -->|Threshold Exceeded| Dispatch[Auto Booking Dispatcher]
  Dispatch --> Marketplace[EcivreS Booking Engine]
```

## Supported Sensor Types
- **HVAC Sensors**: Temperature, humidity, pressure, coil vibration.
- **Smart Water Meters**: Flow rate, leak detection pressure drop.
- **Solar Inverters**: Current output, thermal overload alert.
- **Security Gateways**: Access logging, door sensor state.
