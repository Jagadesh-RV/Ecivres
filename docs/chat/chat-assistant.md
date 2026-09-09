# AI Chat Assistant & Realtime Messaging Architecture

## Overview
EcivreS includes built-in realtime customer-to-provider messaging and an automated AI Assistant for booking suggestions, customer help, and provider knowledge base inquiries.

## Architecture

### 1. Realtime Messaging Engine
- **Service**: `ChatService` (`apps/api/src/modules/chat/chat.service.ts`)
- **Gateway**: `EventsGateway` broadcasts `chat.message` events over Socket.IO to `user_{recipientId}` and `booking_{bookingId}` rooms.
- **REST Endpoints**:
  - `POST /chat/messages` - Send message
  - `GET /chat/messages` - Retrieve conversation history

### 2. AI Assistant Engine
- **Service**: `AiAssistantService` (`apps/api/src/modules/ai/assistant.service.ts`)
- **Capabilities**:
  - **Booking Suggestions**: Generates tailored service choices, estimated pricing, and immediate appointment slots.
  - **Provider FAQ**: Answers inquiries on payouts, commission rates, and cancellation policies.
  - **Customer Support**: Answers inquiries on refunds, payment methods, and promo codes.
- **REST Endpoint**:
  - `POST /ai/assistant`
