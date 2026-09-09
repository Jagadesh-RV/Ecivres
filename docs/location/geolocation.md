# Geolocation & Live Provider Tracking Architecture

## Overview
EcivreS provides real-time location services, Haversine distance calculations, dynamic ETA estimation, and live WebSocket telemetry streaming for provider arrival tracking.

## Components & Flow

### 1. Location Permissions & Acquisition
- **Mobile Hook**: `useLocationPermission` handles iOS and Android fine location permissions.
- **Customer Location**: `useCustomerLocation` retrieves live customer device GPS coordinates.
- **Provider Location**: `useProviderLocationBroadcaster` captures provider telemetry when a booking status moves to `IN_PROGRESS` or `EN_ROUTE`.

### 2. Distance & ETA Engine
- **Haversine Distance**: Calculates spherical distance in kilometers/miles between provider and service site.
- **ETA Calculator**: Estimates transit duration in minutes accounting for urban speed baselines (35 km/h) and a 1.25x traffic multiplier.

### 3. Real-Time Telemetry Streaming
- **Socket.IO Event**: `updateProviderLocation` streams telemetry updates to the `booking_{bookingId}` socket channel.
- **Broadcast Event**: `providerLocationStream` emits real-time coordinate changes to connected customer clients.

### 4. Interactive Map Components
- **Web**: `LiveTrackingMap` (`apps/web/src/components/booking/LiveTrackingMap.tsx`)
- **Mobile**: `MobileLiveTrackingMap` (`apps/mobile/src/components/MobileLiveTrackingMap.tsx`)
