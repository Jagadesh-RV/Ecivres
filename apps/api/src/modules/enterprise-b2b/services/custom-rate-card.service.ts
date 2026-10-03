import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomRateCardService {
  private readonly logger = new Logger(CustomRateCardService.name);
  private readonly rateCardsMap = new Map<string, number>(); // orgId:categoryId -> discountPct

  setNegotiatedRate(orgId: string, categoryId: string, discountPct: number) {
    const key = `${orgId}:${categoryId}`;
    this.rateCardsMap.set(key, discountPct);
    this.logger.log(`Set negotiated rate card for org ${orgId}, category ${categoryId}: ${discountPct}% off`);
  }

  calculateNegotiatedPrice(orgId: string, categoryId: string, standardPrice: number) {
    const key = `${orgId}:${categoryId}`;
    const discountPct = this.rateCardsMap.get(key) || 0;
    const finalPrice = standardPrice * (1 - discountPct / 100);

    return {
      orgId,
      categoryId,
      standardPrice,
      discountPct,
      finalPrice: Math.round(finalPrice * 100) / 100,
    };
  }
}
