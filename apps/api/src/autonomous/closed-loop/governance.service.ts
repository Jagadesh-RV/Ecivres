import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type GovernanceState =
  | 'DRAFT'
  | 'EVALUATING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'MONITORED'
  | 'DEPRECATED'
  | 'RETIRED';

export interface GovernanceTransitionDto {
  entityType: 'POLICY' | 'DECISION' | 'ACTION' | 'EXPERIMENT' | 'AGENT' | 'MODEL';
  entityId: string;
  targetState: GovernanceState;
  reason: string;
  actorId: string;
}

export interface GovernanceRecord {
  id: string;
  entityType: string;
  entityId: string;
  previousState: GovernanceState;
  currentState: GovernanceState;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

@Injectable()
export class GovernanceService {
  private readonly logger = new Logger(GovernanceService.name);
  private readonly entityStates = new Map<string, GovernanceState>();
  private readonly auditLog: GovernanceRecord[] = [];

  constructor(private readonly prisma: PrismaService) {}

  getEntityState(entityType: string, entityId: string): GovernanceState {
    const key = `${entityType}:${entityId}`;
    return this.entityStates.get(key) || 'ACTIVE';
  }

  async transitionState(dto: GovernanceTransitionDto): Promise<GovernanceRecord> {
    const key = `${dto.entityType}:${dto.entityId}`;
    const previousState = this.entityStates.get(key) || 'DRAFT';

    // Validate lifecycle transitions
    const validTransitions: Record<GovernanceState, GovernanceState[]> = {
      DRAFT: ['EVALUATING', 'RETIRED'],
      EVALUATING: ['APPROVED', 'DRAFT', 'RETIRED'],
      APPROVED: ['ACTIVE', 'RETIRED'],
      ACTIVE: ['MONITORED', 'DEPRECATED', 'RETIRED'],
      MONITORED: ['ACTIVE', 'DEPRECATED', 'RETIRED'],
      DEPRECATED: ['RETIRED', 'ACTIVE'],
      RETIRED: [],
    };

    if (!validTransitions[previousState]?.includes(dto.targetState)) {
      throw new BadRequestException(
        `Invalid governance transition from ${previousState} to ${dto.targetState} for ${dto.entityType}.`,
      );
    }

    const id = `gov_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record: GovernanceRecord = {
      id,
      entityType: dto.entityType,
      entityId: dto.entityId,
      previousState,
      currentState: dto.targetState,
      reason: dto.reason,
      changedBy: dto.actorId,
      changedAt: new Date(),
    };

    this.entityStates.set(key, dto.targetState);
    this.auditLog.push(record);

    try {
      await this.prisma.governanceLifecycleRecord.create({
        data: {
          id,
          entityType: dto.entityType,
          entityId: dto.entityId,
          previousState,
          currentState: dto.targetState,
          reason: dto.reason,
          changedBy: dto.actorId,
          changedAt: record.changedAt,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed writing governance record to database: ${err.message}`);
    }

    this.logger.log(`Governance lifecycle transition for ${key}: ${previousState} -> ${dto.targetState} by ${dto.actorId}`);
    return record;
  }

  getAuditLog(entityType?: string, entityId?: string): GovernanceRecord[] {
    if (entityType && entityId) {
      return this.auditLog.filter((r) => r.entityType === entityType && r.entityId === entityId);
    }
    return this.auditLog;
  }
}
