import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FraudIntelligenceService {
  private readonly logger = new Logger(FraudIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calculateBehavioralScore(targetId: string, targetType: string) {
    const behavioralScore = Math.floor(Math.random() * 20); // Low risk 0-20
    this.logger.log(`Calculated behavioral fraud score for ${targetType} ${targetId}: ${behavioralScore}`);
    return this.prisma.fraudRiskScore.upsert({
      where: { targetId },
      create: {
        targetId,
        targetType,
        behavioralScore,
        riskLevel: behavioralScore > 50 ? 'HIGH' : 'LOW',
      },
      update: { behavioralScore },
    });
  }
}
