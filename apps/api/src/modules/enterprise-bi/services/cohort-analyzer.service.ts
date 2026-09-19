import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CohortAnalyzerService {
  private readonly logger = new Logger(CohortAnalyzerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateReport(title: string, type: string) {
    const reportId = `rep_${Date.now()}`;
    const metrics = {
      type,
      activeCohorts: 12,
      retentionRateMonth3: '78.5%',
      mrrGrowth: '14.2%',
      arpu: '$245.00',
    };
    this.logger.log(`Generating BI report ${reportId} (${title}) of type ${type}`);
    return this.prisma.biAnalyticsReport.create({
      data: {
        reportId,
        title,
        metricsJson: JSON.stringify(metrics),
      },
    });
  }
}
