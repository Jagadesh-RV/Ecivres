import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface FinancialFeatures {
  gmvAmount: number;
  averageOrderValue: number;
  takeRatePct: number;
  refundRatePct: number;
  payoutVolumeAmount: number;
}

@Injectable()
export class FinancialFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateFinancialFeatures(): Promise<FinancialFeatures> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const completedPayments = await this.prisma.payment.aggregate({
      where: {
        createdAt: { gte: oneDayAgo },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    const refundedPayments = await this.prisma.payment.count({
      where: {
        createdAt: { gte: oneDayAgo },
        status: 'REFUNDED',
      },
    });

    const totalCount = completedPayments._count.id || 0;
    const gmv = completedPayments._sum.amount || 0;
    const aov = totalCount > 0 ? Number((gmv / totalCount).toFixed(2)) : 0;
    const refundRate = totalCount > 0 ? Number(((refundedPayments / totalCount) * 100).toFixed(2)) : 0;
    const takeRate = 15.0; // 15% platform take rate
    const payoutVolume = Number((gmv * (1 - takeRate / 100)).toFixed(2));

    return {
      gmvAmount: gmv,
      averageOrderValue: aov,
      takeRatePct: takeRate,
      refundRatePct: refundRate,
      payoutVolumeAmount: payoutVolume,
    };
  }
}
