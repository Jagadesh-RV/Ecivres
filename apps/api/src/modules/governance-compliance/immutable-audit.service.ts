import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RecordAuditEventDto } from './dto/governance-compliance-dtos';

export interface AuditRecord {
  id: string;
  tenantId: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetResource: string;
  targetId: string;
  previousHash: string;
  entryHash: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  correlationId: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
  timestamp: Date;
}

export interface AuditChainIntegrityResult {
  isChainValid: boolean;
  totalEntries: number;
  corruptedEntryId?: string;
  checkedAt: Date;
  details: string;
}

@Injectable()
export class ImmutableAuditService {
  private readonly logger = new Logger(ImmutableAuditService.name);
  private readonly GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
  private latestHash = this.GENESIS_HASH;
  private readonly inMemoryLogs: AuditRecord[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Appends an immutable, tamper-evident audit record to the cryptographic hash chain.
   */
  async recordAuditEvent(dto: RecordAuditEventDto): Promise<AuditRecord> {
    const id = `aud_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date();

    // 1. Sanitize sensitive data before hashing or storing
    const sanitizedMetadata = this.sanitizeMetadata(dto.metadata);

    // 2. Cryptographic Hash Chaining
    const previousHash = this.latestHash;
    const entryHash = this.calculateEntryHash(
      previousHash,
      dto.actorId,
      dto.action,
      dto.targetResource,
      dto.targetId,
      now.toISOString(),
      sanitizedMetadata,
    );

    this.latestHash = entryHash;

    const record: AuditRecord = {
      id,
      tenantId: dto.tenantId || 'GLOBAL',
      actorId: dto.actorId,
      actorRole: dto.actorRole,
      action: dto.action,
      targetResource: dto.targetResource,
      targetId: dto.targetId,
      previousHash,
      entryHash,
      metadata: sanitizedMetadata,
      ipAddress: dto.ipAddress,
      correlationId: dto.correlationId,
      status: dto.status || 'SUCCESS',
      failureReason: dto.failureReason,
      timestamp: now,
    };

    this.inMemoryLogs.push(record);

    // 3. Persist to Prisma
    try {
      await this.prisma.immutableAuditLog.create({
        data: {
          id: record.id,
          tenantId: record.tenantId,
          actorId: record.actorId,
          actorRole: record.actorRole,
          action: record.action,
          targetResource: record.targetResource,
          targetId: record.targetId,
          previousHash: record.previousHash,
          entryHash: record.entryHash,
          metadata: record.metadata,
          ipAddress: record.ipAddress,
          correlationId: record.correlationId,
          status: record.status,
          failureReason: record.failureReason,
          timestamp: record.timestamp,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist audit event to db: ${err.message}`);
    }

    this.logger.log(`AUDIT [${record.action}] by ${record.actorId} on ${record.targetResource}:${record.targetId} (Hash: ${entryHash.substr(0, 8)})`);
    return record;
  }

  /**
   * Verifies the cryptographic integrity of the audit chain from genesis to head.
   */
  async verifyChainIntegrity(tenantId?: string): Promise<AuditChainIntegrityResult> {
    const chain = tenantId
      ? this.inMemoryLogs.filter((l) => l.tenantId === tenantId)
      : this.inMemoryLogs;

    let expectedPrevHash = this.GENESIS_HASH;

    for (let i = 0; i < chain.length; i++) {
      const entry = chain[i];

      // Check linkage
      if (entry.previousHash !== expectedPrevHash) {
        this.logger.error(`AUDIT CHAIN CORRUPTION DETECTED at entry ${entry.id}! Link broken.`);
        return {
          isChainValid: false,
          totalEntries: chain.length,
          corruptedEntryId: entry.id,
          checkedAt: new Date(),
          details: `Linkage mismatch at entry ${entry.id}. Expected previous hash '${expectedPrevHash}', found '${entry.previousHash}'.`,
        };
      }

      // Check hash calculation
      const calculatedHash = this.calculateEntryHash(
        entry.previousHash,
        entry.actorId,
        entry.action,
        entry.targetResource,
        entry.targetId,
        entry.timestamp.toISOString(),
        entry.metadata,
      );

      if (entry.entryHash !== calculatedHash) {
        this.logger.error(`AUDIT ENTRY TAMPERING DETECTED at entry ${entry.id}! Content modified.`);
        return {
          isChainValid: false,
          totalEntries: chain.length,
          corruptedEntryId: entry.id,
          checkedAt: new Date(),
          details: `Hash mismatch / Content tampering detected at entry ${entry.id}. Calculated hash does not match stored entryHash.`,
        };
      }

      expectedPrevHash = entry.entryHash;
    }

    return {
      isChainValid: true,
      totalEntries: chain.length,
      checkedAt: new Date(),
      details: 'Audit chain cryptographically verified. Zero tampering detected.',
    };
  }

  /**
   * Fetches audit records for a resource or actor.
   */
  async getAuditHistory(targetResource?: string, targetId?: string, limit: number = 50): Promise<AuditRecord[]> {
    let filtered = this.inMemoryLogs;
    if (targetResource) filtered = filtered.filter((l) => l.targetResource === targetResource);
    if (targetId) filtered = filtered.filter((l) => l.targetId === targetId);

    return filtered.slice(-limit).reverse();
  }

  private calculateEntryHash(
    previousHash: string,
    actorId: string,
    action: string,
    targetResource: string,
    targetId: string,
    isoTimestamp: string,
    metadata: Record<string, any>,
  ): string {
    const raw = `${previousHash}|${actorId}|${action}|${targetResource}|${targetId}|${isoTimestamp}|${JSON.stringify(metadata)}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private sanitizeMetadata(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    const forbiddenPatterns = [
      'password',
      'token',
      'secret',
      'authorization',
      'apikey',
      'api_key',
      'creditcard',
      'cardnumber',
      'card_number',
      'cvv',
      'refreshtoken',
      'refresh_token',
    ];

    for (const key of Object.keys(sanitized)) {
      const lower = key.toLowerCase();
      if (forbiddenPatterns.some((pattern) => lower.includes(pattern))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }
}
