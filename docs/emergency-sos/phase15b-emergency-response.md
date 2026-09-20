# Sprint 15B — Emergency Response Platform

## Overview
The Emergency Response Platform handles sub-30s emergency SOS dispatches, priority algorithm scoring, responder live GPS tracking, and authority notifications.

## APIs
- `POST /emergency-sos/dispatch`: Rapid priority SOS emergency dispatch.
- `GET /emergency-sos/:id/tracking`: Live tracking of responder ETA & geolocation.
