import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FranchiseNetworkService {
  private readonly logger = new Logger(FranchiseNetworkService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onboardNetwork(regionCode: string, name: string, royaltyRate: number) {
    const networkId = `fnet_${Date.now()}`;
    this.logger.log(`Onboarding regional franchise network ${networkId} (${name}) in ${regionCode}`);
    return this.prisma.franchiseNetwork.create({
      data: {
        networkId,
        regionCode,
        name,
        royaltyRate,
        activeBranches: 1,
        status: 'ACTIVE',
      },
    });
  }

  async calculateRoyaltySplit(networkId: string, grossRevenue: number) {
    const network = await this.prisma.franchiseNetwork.findUnique({
      where: { networkId },
    });
    const rate = network ? network.royaltyRate : 0.08;
    const royaltyFee = Math.round(grossRevenue * rate * 100) / 100;
    const netRevenue = Math.round((grossRevenue - royaltyFee) * 100) / 100;
    this.logger.log(`Calculated royalty split for ${networkId}: Gross $${grossRevenue}, Royalty $${royaltyFee}, Net $${netRevenue}`);
    return { networkId, grossRevenue, royaltyRate: rate, royaltyFee, netRevenue };
  }
}
