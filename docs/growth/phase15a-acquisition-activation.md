# Phase 15A — Customer Acquisition & Activation Engine

## Architecture Overview
The Customer Acquisition & Activation engine provides complete funnel attribution tracking from first-session landing through conversion milestones:
1. **Source & Campaign Attribution**: Captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, referrer URLs, and viral referral codes.
2. **Attribution Modeling**: Derives customer acquisition channel, campaign ROI, and Customer Acquisition Cost (CAC).
3. **Activation Lifecycle Milestones**: Tracks 4 key conversion milestones:
   - Profile Completion (25%)
   - First Search (25%)
   - First Booking (25%)
   - First Payment (25%)

## APIs
- `POST /acquisition/track`: Record landing and campaign attribution data.
- `GET /acquisition/attribution/:userId`: Retrieve attributed channel, campaign, and CAC.
- `GET /acquisition/activation/:userId`: Fetch customer activation score and progress.
- `POST /acquisition/activation/milestone`: Update activation milestone state.
