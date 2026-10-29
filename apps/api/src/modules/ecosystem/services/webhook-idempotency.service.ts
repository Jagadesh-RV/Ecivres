import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WebhookIdempotencyService {
  private readonly logger = new Logger(WebhookIdempotencyService.name);
  private readonly seenEvents = new Map<string, { timestamp: number; status: string }>();
  private readonly inFlightLocks = new Set<string>();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Acquires an execution lock for a webhook event to prevent race conditions.
   * Throws ConflictException if already being processed concurrently.
   */
  acquireLock(provider: string, externalEventId: string): boolean {
    const key = `${provider.toUpperCase()}:${externalEventId}`;

    if (this.inFlightLocks.has(key)) {
      this.logger.warn(`Concurrent webhook processing blocked for key ${key}`);
      throw new ConflictException(`Event '${externalEventId}' from '${provider}' is currently being processed.`);
    }

    this.inFlightLocks.add(key);
    return true;
  }

  /**
   * Releases in-flight execution lock.
   */
  releaseLock(provider: string, externalEventId: string): void {
    const key = `${provider.toUpperCase()}:${externalEventId}`;
    this.inFlightLocks.delete(key);
  }

  /**
   * Checks whether the event has already been successfully processed.
   */
  async isDuplicate(provider: string, externalEventId: string): Promise<boolean> {
    const key = `${provider.toUpperCase()}:${externalEventId}`;
    const cached = this.seenEvents.get(key);

    if (cached && cached.status === 'PROCESSED') {
      return true;
    }

    try {
      const existing = await this.prisma.inboundWebhookEvent.findUnique({
        where: {
          provider_externalEventId: {
            provider: provider.toUpperCase(),
            externalEventId,
          },
        },
      });

      if (existing && existing.status === 'PROCESSED') {
        this.seenEvents.set(key, { timestamp: Date.now(), status: 'PROCESSED' });
        return true;
      }
    } catch {}

    return false;
  }

  /**
   * Records that an event has been processed.
   */
  recordProcessed(provider: string, externalEventId: string): void {
    const key = `${provider.toUpperCase()}:${externalEventId}`;
    this.seenEvents.set(key, { timestamp: Date.now(), status: 'PROCESSED' });
    this.evictExpired();
  }

  private evictExpired(): void {
    const cutoff = Date.now() - this.TTL_MS;
    for (const [key, value] of this.seenEvents.entries()) {
      if (value.timestamp < cutoff) {
        this.seenEvents.delete(key);
      }
    }
  }
}
