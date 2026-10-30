import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreatePartnerApiKeyDto,
  PartnerKeyCreatedResponseDto,
  RotatePartnerApiKeyDto,
  RevokePartnerApiKeyDto,
} from '../dto/partner.dto';

export interface PartnerKeyRecord {
  id: string;
  organizationId: string;
  keyName: string;
  keyHash: string;
  keyPrefix: string;
  scopes: string[];
  rateLimitPerMin: number;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expiresAt: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
  revokedBy?: string;
  createdAt: Date;
}

@Injectable()
export class PartnerApiService {
  private readonly logger = new Logger(PartnerApiService.name);
  private readonly inMemoryKeys = new Map<string, PartnerKeyRecord>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Hashes an API key using SHA-256.
   */
  hashKey(plaintextKey: string): string {
    return createHash('sha256').update(plaintextKey).digest('hex');
  }

  /**
   * Generates a new cryptographically secure partner API key.
   */
  async createApiKey(dto: CreatePartnerApiKeyDto): Promise<PartnerKeyCreatedResponseDto> {
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const prefixBytes = randomBytes(4).toString('hex');
    const secretBytes = randomBytes(24).toString('hex');
    const keyPrefix = `ecv_live_${prefixBytes}`;
    const plaintextKey = `${keyPrefix}_${secretBytes}`;
    const keyHash = this.hashKey(plaintextKey);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (dto.expiresInDays ?? 90) * 86400 * 1000);

    const record: PartnerKeyRecord = {
      id: keyId,
      organizationId: dto.organizationId,
      keyName: dto.keyName,
      keyHash,
      keyPrefix,
      scopes: dto.scopes,
      rateLimitPerMin: dto.rateLimitPerMin ?? 120,
      status: 'ACTIVE',
      expiresAt,
      createdAt: now,
    };

    this.inMemoryKeys.set(keyHash, record);

    try {
      await this.prisma.partnerApiKey.create({
        data: {
          id: record.id,
          organizationId: record.organizationId,
          keyName: record.keyName,
          keyHash: record.keyHash,
          keyPrefix: record.keyPrefix,
          scopes: record.scopes as any,
          rateLimitPerMin: record.rateLimitPerMin,
          status: record.status,
          expiresAt: record.expiresAt,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist partner API key to DB: ${err.message}`);
    }

    this.logger.log(`Created partner API key '${dto.keyName}' (${keyPrefix}) for Org ${dto.organizationId}`);

    return {
      keyId,
      keyPrefix,
      plaintextKey,
      organizationId: dto.organizationId,
      scopes: dto.scopes,
      rateLimitPerMin: record.rateLimitPerMin,
      expiresAt,
    };
  }

  /**
   * Validates an API key and required permission scope.
   */
  async authenticateKey(plaintextKey: string, requiredScope?: string): Promise<PartnerKeyRecord> {
    const keyHash = this.hashKey(plaintextKey);
    let record = this.inMemoryKeys.get(keyHash);

    if (!record) {
      try {
        const found = await this.prisma.partnerApiKey.findUnique({
          where: { keyHash },
        });
        if (found) {
          record = {
            id: found.id,
            organizationId: found.organizationId,
            keyName: found.keyName,
            keyHash: found.keyHash,
            keyPrefix: found.keyPrefix,
            scopes: (found.scopes as any) || [],
            rateLimitPerMin: found.rateLimitPerMin,
            status: found.status as any,
            expiresAt: found.expiresAt ?? new Date(Date.now() + 86400000),
            createdAt: found.createdAt,
          };
          this.inMemoryKeys.set(keyHash, record);
        }
      } catch {}
    }

    if (!record) {
      throw new UnauthorizedException('Invalid or unrecognised Partner API key.');
    }

    if (record.status !== 'ACTIVE') {
      throw new UnauthorizedException(`Partner API key is ${record.status}.`);
    }

    if (record.expiresAt < new Date()) {
      record.status = 'EXPIRED';
      throw new UnauthorizedException('Partner API key has expired.');
    }

    if (requiredScope && !record.scopes.includes(requiredScope) && !record.scopes.includes('*')) {
      throw new UnauthorizedException(`API key lacks required scope: '${requiredScope}'.`);
    }

    record.lastUsedAt = new Date();
    return record;
  }

  /**
   * Revokes an existing key immediately.
   */
  async revokeApiKey(dto: RevokePartnerApiKeyDto, revokedBy: string = 'system'): Promise<PartnerKeyRecord> {
    let targetRecord: PartnerKeyRecord | undefined;
    for (const record of this.inMemoryKeys.values()) {
      if (record.id === dto.keyId) {
        targetRecord = record;
        break;
      }
    }

    if (!targetRecord) {
      throw new NotFoundException(`Partner API key '${dto.keyId}' not found.`);
    }

    targetRecord.status = 'REVOKED';
    targetRecord.revokedAt = new Date();
    targetRecord.revokedBy = revokedBy;

    try {
      await this.prisma.partnerApiKey.update({
        where: { id: dto.keyId },
        data: {
          status: 'REVOKED',
          revokedAt: targetRecord.revokedAt,
          revokedBy,
        },
      });
    } catch {}

    this.logger.warn(`REVOKED partner API key ${dto.keyId}. Reason: ${dto.reason}`);
    return targetRecord;
  }

  /**
   * Rotates a key by revoking the old key and issuing a new one with same scopes and settings.
   */
  async rotateApiKey(dto: RotatePartnerApiKeyDto, operator: string = 'system'): Promise<PartnerKeyCreatedResponseDto> {
    const revoked = await this.revokeApiKey({ keyId: dto.keyId, reason: dto.reason }, operator);

    return this.createApiKey({
      organizationId: revoked.organizationId,
      keyName: `${revoked.keyName} (Rotated)`,
      scopes: revoked.scopes,
      rateLimitPerMin: revoked.rateLimitPerMin,
      expiresInDays: 90,
    });
  }
}
