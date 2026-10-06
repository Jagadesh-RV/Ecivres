import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface SupplyFeatures {
  activeProvidersCount: number;
  providerUtilizationPct: number;
  providerResponseRatePct: number;
  supplyDemandRatio: number;
}

@Injectable()
export class SupplyFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateSupplyFeatures(demandBookingsCount: number, region: string = 'GLOBAL'): Promise<SupplyFeatures> {
    const activeProviders = await this.prisma.providerProfile.count({
      where: { isVerified: true },
    });

    const activeCount = activeProviders || 1;
    const ratio = Number((activeCount / Math.max(1, demandBookingsCount)).toFixed(2));
    const utilization = Math.min(100, Number(((demandBookingsCount / (activeCount * 5)) * 100).toFixed(2)));

    return {
      activeProvidersCount: activeCount,
      providerUtilizationPct: utilization,
      providerResponseRatePct: 94.5,
      supplyDemandRatio: ratio,
    };
  }
}
