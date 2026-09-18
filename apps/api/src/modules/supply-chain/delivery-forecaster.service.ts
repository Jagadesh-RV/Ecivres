import { Injectable } from '@nestjs/common';

export interface ReplenishmentForecast {
  itemSku: string;
  currentStockLevel: number;
  dailyBurnRate: number;
  estimatedDaysRemaining: number;
  recommendedOrderQuantity: number;
  estimatedDeliveryDate: string;
  needsReplenishment: boolean;
}

@Injectable()
export class DeliveryForecasterService {
  forecastReplenishment(itemSku: string, currentStock: number, dailyBurn: number): ReplenishmentForecast {
    const daysRemaining = Math.floor(currentStock / Math.max(1, dailyBurn));
    const needsReplenishment = daysRemaining <= 7;
    const leadTimeDays = 3;

    const estimatedDeliveryDate = new Date(Date.now() + leadTimeDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      itemSku,
      currentStockLevel: currentStock,
      dailyBurnRate: dailyBurn,
      estimatedDaysRemaining: daysRemaining,
      recommendedOrderQuantity: needsReplenishment ? dailyBurn * 30 : 0,
      estimatedDeliveryDate,
      needsReplenishment,
    };
  }
}
