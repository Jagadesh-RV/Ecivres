import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DynamicPricingRecommendation {
  serviceId: string;
  basePrice: number;
  recommendedPrice: number;
  multiplier: number;
  reasoning: string[];
  competitorMin: number;
  competitorMax: number;
  competitorAvg: number;
  estimatedProfitMargin: number; // percentage
}

@Injectable()
export class AiPricingAssistantService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateDynamicPrice(
    serviceId: string,
    providerId: string,
    demandMultiplier: number = 1.0,
  ): Promise<DynamicPricingRecommendation> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    const basePrice = service?.price || 100;

    // Simulate competitor analysis
    const competitorMin = Math.round(basePrice * 0.85);
    const competitorMax = Math.round(basePrice * 1.35);
    const competitorAvg = Math.round((competitorMin + competitorMax) / 2);

    const reasoning: string[] = [];
    let multiplier = 1.0;

    // Check peak hour factor
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17) {
      multiplier += 0.15;
      reasoning.push('High daytime booking demand (+15%)');
    }

    if (demandMultiplier > 1.2) {
      multiplier += 0.1;
      reasoning.push('Surge regional booking activity (+10%)');
    }

    const recommendedPrice = Math.round(basePrice * multiplier);
    const estimatedCost = basePrice * 0.4; // 40% estimated overhead
    const estimatedProfitMargin = Math.round(((recommendedPrice - estimatedCost) / recommendedPrice) * 100);

    return {
      serviceId,
      basePrice,
      recommendedPrice,
      multiplier: Number(multiplier.toFixed(2)),
      reasoning,
      competitorMin,
      competitorMax,
      competitorAvg,
      estimatedProfitMargin,
    };
  }

  async suggestDiscountCampaign(providerId: string): Promise<{
    suggestedDiscountPercent: number;
    targetCategory: string;
    expectedBookingLiftPercent: number;
  }> {
    return {
      suggestedDiscountPercent: 15,
      targetCategory: 'Off-Peak Weekday Slots',
      expectedBookingLiftPercent: 35,
    };
  }
}
