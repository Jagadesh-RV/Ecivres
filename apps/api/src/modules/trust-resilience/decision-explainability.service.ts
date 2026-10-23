import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExplainDecisionDto } from './dto/trust-resilience-dtos';

export interface DecisionExplanation {
  explanationId: string;
  decisionId: string;
  tenantId: string;
  businessSummary: string;
  technicalDetails: {
    initiatingEvent: string;
    affectedResource: string;
    policyApplied: string;
    policyVersion: string;
    autonomyLevel: number;
    confidenceScore: number;
    humanApprovalObtained: boolean;
  };
  decisionRationale: {
    selectedAction: string;
    tradeoffAnalysis: string;
    alternativesConsidered: Array<{
      actionType: string;
      score: number;
      discardReason: string;
    }>;
  };
  evidenceSignals: Record<string, any>;
  generatedAt: Date;
}

@Injectable()
export class DecisionExplainabilityService {
  private readonly logger = new Logger(DecisionExplainabilityService.name);
  private readonly inMemoryExplanations = new Map<string, DecisionExplanation>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates and stores a business-readable explanation for an autonomous decision.
   */
  async recordDecisionExplanation(dto: ExplainDecisionDto): Promise<DecisionExplanation> {
    const explanationId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date();

    // Synthesize clear natural language business summary
    const businessSummary = this.synthesizeBusinessSummary(dto);

    // Redact any potentially sensitive internal data from evidence signals
    const sanitizedSignals = this.sanitizeEvidence(dto.keyEvidenceSignals);

    const explanation: DecisionExplanation = {
      explanationId,
      decisionId: dto.decisionId,
      tenantId: dto.tenantId || 'GLOBAL',
      businessSummary,
      technicalDetails: {
        initiatingEvent: dto.initiatingEvent,
        affectedResource: dto.affectedResource,
        policyApplied: dto.policyApplied,
        policyVersion: dto.policyVersion || 'v1.0',
        autonomyLevel: dto.autonomyLevel,
        confidenceScore: dto.confidenceScore,
        humanApprovalObtained: dto.humanApprovalObtained || false,
      },
      decisionRationale: {
        selectedAction: dto.selectedAction,
        tradeoffAnalysis: dto.tradeoffAnalysis,
        alternativesConsidered: dto.alternativesConsidered,
      },
      evidenceSignals: sanitizedSignals,
      generatedAt: now,
    };

    // Cache in memory
    this.inMemoryExplanations.set(dto.decisionId, explanation);

    // Persist to Prisma
    try {
      await this.prisma.decisionExplanationRecord.create({
        data: {
          id: explanationId,
          decisionId: dto.decisionId,
          tenantId: dto.tenantId || 'GLOBAL',
          businessSummary,
          initiatingEvent: dto.initiatingEvent,
          affectedResource: dto.affectedResource,
          policyApplied: dto.policyApplied,
          policyVersion: dto.policyVersion || 'v1.0',
          autonomyLevel: dto.autonomyLevel,
          confidenceScore: dto.confidenceScore,
          selectedAction: dto.selectedAction,
          alternativesConsidered: dto.alternativesConsidered as any,
          keyEvidenceSignals: sanitizedSignals as any,
          tradeoffAnalysis: dto.tradeoffAnalysis,
          humanApprovalObtained: dto.humanApprovalObtained || false,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist decision explanation to database: ${err?.message}`);
    }

    return explanation;
  }

  /**
   * Retrieves the explanation for a decision by decisionId.
   */
  async getExplanation(decisionId: string): Promise<DecisionExplanation> {
    const inMem = this.inMemoryExplanations.get(decisionId);
    if (inMem) return inMem;

    try {
      const record = await this.prisma.decisionExplanationRecord.findUnique({
        where: { decisionId },
      });
      if (record) {
        return {
          explanationId: record.id,
          decisionId: record.decisionId,
          tenantId: record.tenantId,
          businessSummary: record.businessSummary,
          technicalDetails: {
            initiatingEvent: record.initiatingEvent,
            affectedResource: record.affectedResource,
            policyApplied: record.policyApplied,
            policyVersion: record.policyVersion,
            autonomyLevel: record.autonomyLevel,
            confidenceScore: record.confidenceScore,
            humanApprovalObtained: record.humanApprovalObtained,
          },
          decisionRationale: {
            selectedAction: record.selectedAction,
            tradeoffAnalysis: record.tradeoffAnalysis,
            alternativesConsidered: record.alternativesConsidered as any,
          },
          evidenceSignals: record.keyEvidenceSignals as any,
          generatedAt: record.createdAt,
        };
      }
    } catch {
      // ignore
    }

    throw new NotFoundException(`Explanation for decision '${decisionId}' not found.`);
  }

  private synthesizeBusinessSummary(dto: ExplainDecisionDto): string {
    const confidencePct = Math.round(dto.confidenceScore * 100);
    const altCount = dto.alternativesConsidered.length;
    return (
      `Autonomous action '${dto.selectedAction}' was dispatched on resource '${dto.affectedResource}' ` +
      `in response to event '${dto.initiatingEvent}'. Decision was evaluated with ${confidencePct}% confidence ` +
      `under policy '${dto.policyApplied}' (Autonomy Level ${dto.autonomyLevel}). ` +
      `${altCount} alternative action(s) were evaluated and ruled out based on trade-off constraints.`
    );
  }

  private sanitizeEvidence(signals: Record<string, any>): Record<string, any> {
    const sanitized = { ...signals };
    const sensitivePatterns = ['secret', 'password', 'token', 'cardnumber', 'cvv', 'auth'];
    for (const key of Object.keys(sanitized)) {
      const lower = key.toLowerCase();
      if (sensitivePatterns.some((pat) => lower.includes(pat))) {
        delete sanitized[key];
      }
    }
    return sanitized;
  }
}
