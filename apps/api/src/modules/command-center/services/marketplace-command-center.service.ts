import { Injectable, Logger } from '@nestjs/common';
import { MarketplaceHealthService } from './marketplace-health.service';
import { MarketplaceAlertService } from './marketplace-alert.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MarketplaceCommandCenterService {
  private readonly logger = new Logger(MarketplaceCommandCenterService.name);

  constructor(
    private readonly healthService: MarketplaceHealthService,
    private readonly alertService: MarketplaceAlertService,
    private readonly prisma: PrismaService,
  ) {}

  async getFullCommandCenterState() {
    this.logger.log('Aggregating complete Marketplace Command Center state...');

    const [health, financial, operational, alerts] = await Promise.all([
      this.healthService.getMarketplaceHealth(),
      this.healthService.getFinancialHealth(),
      this.healthService.getOperationalHealth(),
      this.alertService.getActiveAlerts(),
    ]);

    const pendingApprovalsCount = await this.prisma.approvalRequest.count({
      where: { status: 'PENDING' },
    });

    const activeAnomaliesCount = await this.prisma.anomaly.count({
      where: { status: { in: ['DETECTED', 'INVESTIGATING'] } },
    });

    return {
      timestamp: new Date(),
      health,
      financial,
      operational,
      alerts,
      intelligenceSummary: {
        activeAnomaliesCount,
        pendingApprovalsCount,
        unresolvedOperationalRisks: alerts.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL').length,
      },
    };
  }
}
