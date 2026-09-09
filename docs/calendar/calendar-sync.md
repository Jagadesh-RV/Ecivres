# Calendar Synchronization & Availability Architecture

## Overview
EcivreS provides real-time provider availability calculation, automatic conflict detection, and bi-directional calendar synchronization with Google Calendar and Microsoft Outlook.

## Features

### 1. Availability Engine
- Evaluates provider working hour rules and subtracts existing marketplace bookings.
- Generates dynamic time slot grids (`getProviderAvailableSlots`).

### 2. External Calendar Integrations
- **Google Calendar Sync**: `syncToGoogleCalendar` creates and updates events in Google Calendar.
- **Outlook Sync**: `syncToOutlookCalendar` integrates with Microsoft Graph API.

### 3. Automatic Conflict Detection
- `detectSchedulingConflicts` validates proposed booking slots against existing appointments.
- Considers service execution duration plus a 15-minute transit buffer.
- Suggests alternative available slots when a conflict is detected.
