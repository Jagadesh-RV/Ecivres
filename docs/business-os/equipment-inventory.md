# Provider Business OS — Equipment Inventory & Tool Asset Management

## Overview
The Equipment Inventory engine inside EcivreS Provider Business OS enables service businesses and sole proprietors to track capital tool assets, calculate monthly straight-line depreciation, and schedule automated maintenance alerts.

## Key Features
- **Asset Registration**: Record equipment details, serial numbers, purchase price, and expected lifespan.
- **Depreciation Calculator**: Calculates straight-line monthly depreciation and tracks active net book value.
- **Maintenance Scheduler**: Triggers routine 90-day maintenance service notifications.

## API Endpoint
- **POST** `/api/v1/business-os/equipment`
  ```json
  {
    "providerId": "prov_55",
    "equipmentName": "Commercial Pressure Washer",
    "purchaseCostUsd": 1200,
    "expectedLifespanMonths": 24,
    "serialNumber": "PW-9981-X"
  }
  ```
