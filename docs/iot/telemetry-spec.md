# IoT Sensor Telemetry & Anomaly Threshold Specifications

## MQTT Topic Scheme
`ecivres/telemetry/{deviceType}/{deviceId}`

## Telemetry Payload Schema
```json
{
  "deviceId": "dev_hvac_991",
  "timestamp": 1789500000000,
  "temperatureCelsius": 88.5,
  "humidityPercentage": 45,
  "vibrationHz": 125.2,
  "pressurePsi": 32.0
}
```

## Predictive Maintenance Anomaly Thresholds
| Metric | Warning Threshold | Critical Threshold | Automated Action |
| :--- | :--- | :--- | :--- |
| Temperature | > 75 °C | > 85 °C | Auto-dispatch HVAC repair technician |
| Motor Vibration | > 90 Hz | > 120 Hz | Flag bearing failure risk & schedule inspection |
| Water Pressure | < 20 PSI | < 10 PSI | Flag leak emergency & isolate main valve |
