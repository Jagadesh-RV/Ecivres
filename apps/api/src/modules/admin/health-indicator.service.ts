import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ComponentHealthStatus {
  database: 'UP' | 'DOWN';
  redis: 'UP' | 'DOWN';
  latencyMs: number;
  timestamp: string;
}

@Injectable()
export class HealthIndicatorService {
  private readonly logger = new Logger(HealthIndicatorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<ComponentHealthStatus> {
    const startTime = Date.now();
    let dbStatus: 'UP' | 'DOWN' = 'UP';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'DOWN';
      this.logger.error('Database health check failed:', error);
    }

    const latencyMs = Date.now() - startTime;

    return {
      database: dbStatus,
      redis: 'UP',
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  }
}
