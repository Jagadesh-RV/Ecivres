import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GovernDecisionActionDto } from './dto/governance-compliance-dtos';

export interface GovernedDecisionRecord {
  decisionId: string;
  governanceStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  operatorId: string;
  justification: string;
  overrideParameters?: Record<string, any>;
  governedAt: Date;
}

@Injectable()
export class AutonomousGovernanceService {
  private readonly logger = new Logger(AutonomousGovernanceService.name);
  private readonly inMemoryGovernances = new Map<string, GovernedDecisionRecord>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies an authoritative human operator governance decision to an autonomous proposal.
   */
  async governDecision(dto: GovernDecisionActionDto): Promise<GovernedDecisionRecord> {
    const record: GovernedDecisionRecord = {
      decisionId: dto.decisionId,
      governanceStatus: dto.action,
      operatorId: dto.operatorId,
      justification: dto.justification,
      overrideParameters: dto.overrideParameters,
      governedAt: new Date(),
    };

    this.inMemoryGovernances.set(dto.decisionId, record);

    // Persist to GovernanceLifecycleRecord
    try {
      await (this.prisma as any).governanceLifecycleRecord?.create({
        data: {
          id: `gov_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          entityType: 'DECISION',
          entityId: dto.decisionId,
          previousState: 'PENDING_REVIEW',
          currentState: dto.action,
          reason: dto.justification,
          changedBy: dto.operatorId,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist governance lifecycle log: ${err.message}`);
    }

    this.logger.log(`Decision ${dto.decisionId} GOVERNED as ${dto.action} by ${dto.operatorId}. Justification: ${dto.justification}`);
    return record;
  }

  /**
   * Retrieves governance record for a decision.
   */
  async getDecisionGovernance(decisionId: string): Promise<GovernedDecisionRecord> {
    const found = this.inMemoryGovernances.get(decisionId);
    if (found) return found;

    try {
      const dbRecord = await (this.prisma as any).governanceLifecycleRecord?.findFirst({
        where: { entityType: 'DECISION', entityId: decisionId },
        orderBy: { changedAt: 'desc' },
      });
      if (dbRecord) {
        return {
          decisionId: dbRecord.entityId,
          governanceStatus: dbRecord.currentState as any,
          operatorId: dbRecord.changedBy,
          justification: dbRecord.reason,
          governedAt: dbRecord.changedAt,
        };
      }
    } catch {}

    throw new NotFoundException(`Governance record for decision '${decisionId}' not found.`);
  }
}
