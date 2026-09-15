# Autonomous AI Marketplace Architecture

## System Overview

EcivreS Phase 12 introduces **Autonomous AI Marketplace Agents** for both customers and service providers.

```
Customer Goal Prompt → BookingPlannerService → Multi-Step Schedule → Escrow Lock
                                                                        ↓
Provider Agent ← NegotiationAssistantService ← Counter Offer Strategy
```

### Core Components

1. **BookingPlannerService**: Decomposes complex multi-category goals (e.g. "Prepare home for winter") into ordered service bookings with budget limits.
2. **NegotiationAssistantService**: Evaluates price flexibility and generates counter offers within a 15% margin to maximize deal conversion.
3. **AutoReschedulingService**: Continuously monitors calendar conflicts and proposes optimal alternative time slots.
4. **ProviderAgentService**: Handles automated message replies and calculates churn risk for customer retention actions.
