import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GracefulShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(GracefulShutdownService.name);
  private isShuttingDown = false;
  private activeRequestCount = 0;
  private readonly DRAIN_TIMEOUT_MS = 10000;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tracks an incoming request to prevent terminating mid-transaction during rollout.
   */
  trackRequestStart(): boolean {
    if (this.isShuttingDown) {
      return false; // Reject new traffic during shutdown phase
    }
    this.activeRequestCount++;
    return true;
  }

  /**
   * Decrements active request counter upon completion.
   */
  trackRequestEnd(): void {
    this.activeRequestCount = Math.max(0, this.activeRequestCount - 1);
  }

  /**
   * Queries whether application is currently shutting down.
   */
  isDraining(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Returns current active in-flight request count.
   */
  getActiveRequestCount(): number {
    return this.activeRequestCount;
  }

  /**
   * Invoked automatically by NestJS during SIGTERM / SIGINT shutdown signals.
   */
  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.warn(`Received shutdown signal '${signal || 'SIGTERM'}'. Initiating graceful drain...`);
    this.isShuttingDown = true;

    const startTime = Date.now();

    // Drain active in-flight requests with bounded timeout
    while (this.activeRequestCount > 0 && Date.now() - startTime < this.DRAIN_TIMEOUT_MS) {
      this.logger.log(
        `Draining active requests: ${this.activeRequestCount} remaining. Waiting 200ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (this.activeRequestCount > 0) {
      this.logger.warn(
        `Drain timeout elapsed (${this.DRAIN_TIMEOUT_MS}ms). Forcing shutdown with ${this.activeRequestCount} requests unfinished.`,
      );
    } else {
      this.logger.log(`All in-flight requests drained cleanly in ${Date.now() - startTime}ms.`);
    }

    // Gracefully disconnect database client
    try {
      this.logger.log('Disconnecting Prisma PostgreSQL connection pool...');
      await this.prisma.$disconnect();
      this.logger.log('Prisma disconnected successfully.');
    } catch (err: any) {
      this.logger.error(`Error disconnecting database client: ${err?.message}`);
    }
  }
}

