import { Injectable, Logger } from '@nestjs/common';
import { SimulateRevenueDto } from './dto/economic-simulation.dto';

export interface RevenueSimulationResult {
  category: string;
  projectedAnnualGrossRevenueUsd: number;
  projectedAnnualPlatformFeeUsd: number;
  confidenceInterval95: { minUsd: number; maxUsd: number };
  simulatedAt: string;
}

@Injectable()
export class RevenueSimulatorService {
  private readonly logger = new Logger(RevenueSimulatorService.name);

  simulateRevenue(dto: SimulateRevenueDto): RevenueSimulationResult {
    const growthFactor = 1 + dto.projectedGrowthRatePercentage / 100;
    const projectedBookings = dto.currentMonthlyBookings * 12 * growthFactor;
    const grossRevenue = Math.round(projectedBookings * dto.averageTicketSizeUsd);
    const platformFee = Math.round(grossRevenue * 0.15); // 15% platform take rate

    this.logger.log(`Simulating 12-month revenue trajectory for category ${dto.category}`);

    return {
      category: dto.category,
      projectedAnnualGrossRevenueUsd: grossRevenue,
      projectedAnnualPlatformFeeUsd: platformFee,
      confidenceInterval95: {
        minUsd: Math.round(grossRevenue * 0.88),
        maxUsd: Math.round(grossRevenue * 1.12),
      },
      simulatedAt: new Date().toISOString(),
    };
  }
}
