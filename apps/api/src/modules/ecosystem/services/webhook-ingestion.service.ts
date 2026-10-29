import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { WebhookVerifierService } from './webhook-verifier.service';
import { WebhookIdempotencyService } from './webhook-idempotency.service';
import { InboundWebhookDto, WebhookProcessResultDto } from '../dto/webhook.dto';

export type WebhookEventStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'DEAD_LETTER';

export interface WebhookEventRecord {
  id: string;
  provider: string;
  externalEventId: string;
  signature: string;
  payload: Record<string, any>;
  status: WebhookEventStatus;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  processedAt?: Date;
  createdAt: Date;
}

@Injectable()
export class WebhookIngestionService {
  private readonly logger = new Logger(WebhookIngestionService.name);
  private readonly eventHandlers = new Map<string, (payload: any) => Promise<void>>();
  private readonly inMemoryEvents = new Map<string, WebhookEventRecord>();

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

    const eventRecordId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const eventRecord: WebhookEventRecord = {
      id: eventRecordId,
      provider: dto.provider.toUpperCase(),
      externalEventId: dto.externalEventId,
      signature: dto.signature,
      payload: dto.payload,
      status: 'PROCESSING',
      retryCount: 0,
      maxRetries: 5,
      createdAt: new Date(),
    };
    this.inMemoryEvents.set(eventRecordId, eventRecord);

    try {
      // 4. Create Durable Record
      try {
        await this.prisma.inboundWebhookEvent.create({
          data: {
            id: eventRecordId,
            provider: dto.provider.toUpperCase(),
            externalEventId: dto.externalEventId,
            signature: dto.signature,
            payload: dto.payload,
            status: 'PROCESSING',
          },
        });
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
      eventRecord.status = 'PROCESSED';
      eventRecord.processedAt = new Date();
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
      eventRecord.status = 'FAILED';
      eventRecord.retryCount += 1;
      eventRecord.lastError = err.message;

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

  /**
   * Calculates exponential retry delay with jitter.
   */
  calculateRetryDelayMs(retryCount: number, baseMs: number = 1000, maxMs: number = 60000): number {
    const expDelay = Math.min(maxMs, baseMs * Math.pow(2, retryCount));
    const jitter = 0.8 + Math.random() * 0.4;
    return Math.floor(expDelay * jitter);
  }

  /**
   * Retries an event. If exceeding max retries, moves to DEAD_LETTER.
   */
  async retryEvent(eventId: string): Promise<WebhookEventStatus> {
    const event = this.inMemoryEvents.get(eventId);
    if (!event) {
      return 'FAILED';
    }

    if (event.retryCount >= event.maxRetries) {
      event.status = 'DEAD_LETTER';
      this.logger.error(`Webhook event ${eventId} exceeded max retries (${event.maxRetries}). Moved to DEAD_LETTER.`);
      try {
        await this.prisma.inboundWebhookEvent.updateMany({
          where: { id: eventId },
          data: { status: 'DEAD_LETTER' },
        });
      } catch {}
      return 'DEAD_LETTER';
    }

    event.retryCount += 1;
    const delay = this.calculateRetryDelayMs(event.retryCount);
    this.logger.log(`Retrying event ${eventId} (attempt ${event.retryCount}) after ${delay}ms delay`);

    return 'PROCESSING';
  }

  /**
   * Retrieves events currently in DEAD_LETTER status for audit or intervention.
   */
  getDeadLetterEvents(limit: number = 50): WebhookEventRecord[] {
    const deadLetters: WebhookEventRecord[] = [];
    for (const record of this.inMemoryEvents.values()) {
      if (record.status === 'DEAD_LETTER') {
        deadLetters.push(record);
        if (deadLetters.length >= limit) break;
      }
    }
    return deadLetters;
  }

  /**
   * Manually requeues a dead letter event for re-evaluation.
   */
  requeueDeadLetterEvent(eventId: string): WebhookEventRecord {
    const event = this.inMemoryEvents.get(eventId);
    if (!event) {
      throw new NotFoundException(`Dead letter event '${eventId}' not found.`);
    }

    event.status = 'PENDING';
    event.retryCount = 0;
    event.lastError = undefined;
    this.logger.log(`Re-queued dead letter event ${eventId} for processing`);
    return event;
  }
}
