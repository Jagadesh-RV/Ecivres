import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { WebhookVerifierService } from './webhook-verifier.service';
import { WebhookIdempotencyService } from './webhook-idempotency.service';
import { InboundWebhookDto, WebhookProcessResultDto } from '../dto/webhook.dto';

export type WebhookEventStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'DEAD_LETTER';

@Injectable()
export class WebhookIngestionService {
  private readonly logger = new Logger(WebhookIngestionService.name);
  private readonly eventHandlers = new Map<string, (payload: any) => Promise<void>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly verifier: WebhookVerifierService,
    private readonly idempotency: WebhookIdempotencyService,
  ) {}

  registerHandler(eventType: string, handler: (payload: any) => Promise<void>): void {
    this.eventHandlers.set(eventType.toUpperCase(), handler);
  }

  /**
   * Main entrypoint: verifies, checks idempotency, durably records, and transitions states.
   */
  async ingestWebhook(dto: InboundWebhookDto, secret: string): Promise<WebhookProcessResultDto> {
    const start = Date.now();
    const rawPayload = JSON.stringify(dto.payload);

    // 1. Signature Verification
    const isValid = this.verifier.verifySignature(rawPayload, dto.signature, secret, dto.timestamp);
    if (!isValid) {
      throw new BadRequestException(`Invalid webhook signature for provider ${dto.provider}`);
    }

    // 2. Idempotency Check (fast duplicate rejection)
    const isDuplicate = await this.idempotency.isDuplicate(dto.provider, dto.externalEventId);
    if (isDuplicate) {
      this.logger.log(`Ignoring duplicate webhook event ${dto.externalEventId} from ${dto.provider}`);
      return {
        eventId: dto.externalEventId,
        status: 'PROCESSED',
        provider: dto.provider,
        isDuplicate: true,
        latencyMs: Date.now() - start,
      };
    }

    // 3. Concurrency Lock
    this.idempotency.acquireLock(dto.provider, dto.externalEventId);

    let eventRecordId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      // 4. Create Durable Record in PENDING status
      try {
        const created = await this.prisma.inboundWebhookEvent.create({
          data: {
            id: eventRecordId,
            provider: dto.provider.toUpperCase(),
            externalEventId: dto.externalEventId,
            signature: dto.signature,
            payload: dto.payload,
            status: 'PROCESSING',
          },
        });
        eventRecordId = created.id;
      } catch (err: any) {
        this.logger.warn(`Could not persist webhook event record to database: ${err.message}`);
      }

      // 5. Execute Registered Business Handler
      const eventType = (dto.payload?.type || dto.payload?.event || 'DEFAULT').toUpperCase();
      const handler = this.eventHandlers.get(eventType);
      if (handler) {
        await handler(dto.payload);
      }

      // 6. Transition to PROCESSED
      try {
        await this.prisma.inboundWebhookEvent.updateMany({
          where: { provider: dto.provider.toUpperCase(), externalEventId: dto.externalEventId },
          data: { status: 'PROCESSED', processedAt: new Date() },
        });
      } catch {}

      this.idempotency.recordProcessed(dto.provider, dto.externalEventId);

      return {
        eventId: eventRecordId,
        status: 'PROCESSED',
        provider: dto.provider,
        isDuplicate: false,
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      // Record failure
      try {
        await this.prisma.inboundWebhookEvent.updateMany({
          where: { provider: dto.provider.toUpperCase(), externalEventId: dto.externalEventId },
          data: {
            status: 'FAILED',
            lastError: err.message,
            retryCount: { increment: 1 },
          },
        });
      } catch {}

      return {
        eventId: eventRecordId,
        status: 'FAILED',
        provider: dto.provider,
        isDuplicate: false,
        latencyMs: Date.now() - start,
        error: err.message,
      };
    } finally {
      this.idempotency.releaseLock(dto.provider, dto.externalEventId);
    }
  }
}
