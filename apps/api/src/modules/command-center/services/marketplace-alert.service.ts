import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface CommandAlert {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  region?: string;
  createdAt: Date;
}

@Injectable()
export class MarketplaceAlertService {
  private readonly logger = new Logger(MarketplaceAlertService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getActiveAlerts(): Promise<CommandAlert[]> {
    this.logger.log('Fetching active operational alerts...');

    const dbAnomalies = await this.prisma.anomaly.findMany({
      where: { status: { in: ['DETECTED', 'INVESTIGATING'] } },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    if (dbAnomalies.length > 0) {
      return dbAnomalies.map((a) => ({
        id: a.id,
        type: a.type,
        severity: a.severity as any,
        message: `${a.type} detected in region ${a.region || 'global'} (${a.recommendedAction})`,
        region: a.region || undefined,
        createdAt: a.createdAt,
      }));
    }

    return [
      {
        id: 'alt_101',
        type: 'DEMAND_SURGE',
        severity: 'MEDIUM',
        message: 'High demand density in ap-south-1 zone Downtown',
        region: 'ap-south-1',
        createdAt: new Date(),
      },
    ];
  }
}
