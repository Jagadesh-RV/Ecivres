import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DetectAnomalyDto } from '../dto/detect-anomaly.dto';
import { UpdateAnomalyStatusDto } from '../dto/update-anomaly-status.dto';

@Injectable()
export class AnomalyEventService {
  private readonly logger = new Logger(AnomalyEventService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAnomaly(dto: DetectAnomalyDto) {
    this.logger.warn(`Persisting detected anomaly: ${dto.type} (${dto.severity})`);
    return this.prisma.anomaly.create({
      data: {
        type: dto.type,
        severity: dto.severity as any,
        region: dto.region,
        category: dto.category,
        evidence: dto.evidence as any,
        confidence: dto.confidence ?? 1.0,
        recommendedAction: dto.recommendedAction,
        status: 'DETECTED',
      },
    });
  }

  async updateStatus(id: string, dto: UpdateAnomalyStatusDto) {
    this.logger.log(`Updating anomaly ${id} status to ${dto.status}`);
    return this.prisma.anomaly.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  async getAnomalies(status?: string, region?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (region) where.region = region;
    return this.prisma.anomaly.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
