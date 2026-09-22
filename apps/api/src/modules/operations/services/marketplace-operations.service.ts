import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MarketplaceOperationsService {
  private readonly logger = new Logger(MarketplaceOperationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createIncident(title: string, description: string, severity: string = 'MEDIUM') {
    const incidentId = `inc_${Date.now()}`;
    this.logger.warn(`Logging live marketplace incident ${incidentId} [${severity}]: ${title}`);
    return this.prisma.operationsIncident.create({
      data: {
        incidentId,
        title,
        description,
        severity,
        status: 'OPEN',
        slaBreached: severity === 'CRITICAL',
      },
    });
  }
}
