import { Injectable, Logger } from '@nestjs/common';

export interface OfferNegotiationRequest {
  serviceId: string;
  originalPrice: number;
  targetPrice: number;
  userFlexibility: 'STRICT' | 'MODERATE' | 'HIGH';
}

export interface NegotiationResult {
  recommendedOffer: number;
  acceptanceProbability: number; // 0-1
  suggestedCounterMessage: string;
}

@Injectable()
export class NegotiationAssistantService {
  private readonly logger = new Logger(NegotiationAssistantService.name);

  analyzeCounterOffer(req: OfferNegotiationRequest): NegotiationResult {
    const minAcceptablePrice = req.originalPrice * 0.85;
    const recommendedOffer = Math.max(req.targetPrice, minAcceptablePrice);
    const acceptanceProbability = Math.min(1.0, Math.max(0.2, (recommendedOffer / req.originalPrice)));

    this.logger.log(`Analyzing negotiation for service ${req.serviceId}: Recommended ${recommendedOffer} (Prob: ${acceptanceProbability})`);

    return {
      recommendedOffer,
      acceptanceProbability,
      suggestedCounterMessage: `I am happy to book your service today for \$${recommendedOffer}. Looking forward to confirming!`,
    };
  }
}
