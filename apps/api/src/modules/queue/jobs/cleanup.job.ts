import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CleanupJobProcessor {
  private readonly logger = new Logger(CleanupJobProcessor.name);

  constructor(private prisma: PrismaService) {}

  async processExpiredRefreshTokensCleanup() {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    this.logger.log(`Automated Cleanup Job: Purged ${result.count} expired refresh tokens from database`);
    return { purgedTokensCount: result.count };
  }
}
