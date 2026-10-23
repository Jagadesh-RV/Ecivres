import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DetectTrustRiskDto, ReviewIncidentDto, SubmitAppealDto } from './dto/trust-resilience-dtos';

export interface TrustEvaluationResult {
  incidentId: string;
  targetType: string;
  targetId: string;
  incidentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore: number;
  evidenceSignals: Record<string, any>;
  provenance: {
    evaluatedAt: Date;
    ruleEngineVersion: string;
    deterministicChecksPassed: boolean;
    statisticalAnomalyScore: number;
  };
  requiresHumanReview: boolean;
  recommendedAction: 'ALLOW' | 'MONITOR' | 'FLAG_FOR_REVIEW' | 'REQUIRE_STEP_UP' | 'HOLD_FOR_OPERATOR';
  status: 'DETECTED' | 'IN_REVIEW' | 'CONFIRMED' | 'OVERRIDDEN' | 'DISMISSED';
}

@Injectable()
export class MarketplaceTrustService {
  private readonly logger = new Logger(MarketplaceTrustService.name);
  private readonly inMemoryIncidents = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates incoming telemetry signals against marketplace trust & risk heuristics.
   */
  async evaluateTrustRisk(dto: DetectTrustRiskDto): Promise<TrustEvaluationResult> {
    const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date();

    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let confidenceScore = 0.85;
    let requiresHumanReview = false;
    let recommendedAction: TrustEvaluationResult['recommendedAction'] = 'ALLOW';
    let statisticalScore = 0.1;

    // 1. Booking Abuse Evaluation
    if (dto.incidentType === 'BOOKING_ABUSE') {
      const { cancellationCount = 0, bookingVelocityPerHour = 0, unverifiedAddress = false } = dto.evidenceSignals;
      if (cancellationCount >= 3 || bookingVelocityPerHour > 10) {
        severity = cancellationCount >= 5 ? 'HIGH' : 'MEDIUM';
        statisticalScore = 0.88;
        requiresHumanReview = true;
        recommendedAction = severity === 'HIGH' ? 'HOLD_FOR_OPERATOR' : 'FLAG_FOR_REVIEW';
      }
    }

    // 2. Review Manipulation Detection
    else if (dto.incidentType === 'REVIEW_MANIPULATION') {
      const { consecutiveFiveStarBursts = 0, accountAgeHours = 24, textSimilarityRatio = 0 } = dto.evidenceSignals;
      if (consecutiveFiveStarBursts >= 4 || textSimilarityRatio > 0.85) {
        severity = 'HIGH';
        confidenceScore = 0.92;
        statisticalScore = 0.95;
        requiresHumanReview = true;
        recommendedAction = 'HOLD_FOR_OPERATOR';
      }
    }

    // 3. Payment Velocity & Fraud Prevention (Data Minimized)
    else if (dto.incidentType === 'PAYMENT_VELOCITY') {
      const { failedAttemptCount = 0, cardTokenCount = 1 } = dto.evidenceSignals;
      if (failedAttemptCount >= 3 || cardTokenCount >= 4) {
        severity = failedAttemptCount >= 5 ? 'CRITICAL' : 'HIGH';
        confidenceScore = 0.96;
        statisticalScore = 0.98;
        requiresHumanReview = true;
        recommendedAction = 'HOLD_FOR_OPERATOR';
      }
    }

    // 4. Provider Reliability Scoring
    else if (dto.incidentType === 'PROVIDER_UNRELIABILITY') {
      const { disputeRate = 0, noShowRate = 0 } = dto.evidenceSignals;
      if (disputeRate > 0.15 || noShowRate > 0.1) {
        severity = disputeRate > 0.3 ? 'HIGH' : 'MEDIUM';
        confidenceScore = 0.89;
        statisticalScore = 0.82;
        requiresHumanReview = severity === 'HIGH';
        recommendedAction = 'FLAG_FOR_REVIEW';
      }
    }

    const result: TrustEvaluationResult = {
      incidentId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      incidentType: dto.incidentType,
      severity,
      confidenceScore,
      evidenceSignals: dto.evidenceSignals,
      provenance: {
        evaluatedAt: now,
        ruleEngineVersion: 'v19.1.0',
        deterministicChecksPassed: severity === 'LOW',
        statisticalAnomalyScore: statisticalScore,
      },
      requiresHumanReview,
      recommendedAction,
      status: requiresHumanReview ? 'IN_REVIEW' : 'DETECTED',
    };

    // Cache in-memory
    this.inMemoryIncidents.set(incidentId, result);

    // Persist to Prisma
    try {
      await this.prisma.marketplaceTrustIncident.create({
        data: {
          id: incidentId,
          tenantId: dto.tenantId || 'GLOBAL',
          targetType: dto.targetType,
          targetId: dto.targetId,
          incidentType: dto.incidentType,
          severity,
          confidenceScore,
          evidenceSignals: dto.evidenceSignals,
          status: result.status,
          requiresHumanReview,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not persist trust incident to database: ${err?.message}`);
    }

    return result;
  }

  /**
   * Resolves a flagged trust incident via authorized operator review.
   */
  async reviewIncident(dto: ReviewIncidentDto): Promise<any> {
    const existing = this.inMemoryIncidents.get(dto.incidentId);
    const updatedStatus = dto.decision;

    if (existing) {
      existing.status = updatedStatus;
      existing.reviewerId = dto.reviewerId;
      existing.reviewNotes = dto.notes;
    }

    try {
      await this.prisma.marketplaceTrustIncident.update({
        where: { id: dto.incidentId },
        data: {
          status: updatedStatus,
          reviewerId: dto.reviewerId,
          reviewNotes: dto.notes,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not update incident in database: ${err?.message}`);
    }

    this.logger.log(`Trust incident ${dto.incidentId} reviewed by ${dto.reviewerId}: ${updatedStatus}`);
    return {
      incidentId: dto.incidentId,
      status: updatedStatus,
      reviewerId: dto.reviewerId,
      reviewedAt: new Date(),
      notes: dto.notes,
    };
  }

  /**
   * Submits an appeal against a confirmed risk decision.
   */
  async submitAppeal(dto: SubmitAppealDto): Promise<any> {
    const existing = this.inMemoryIncidents.get(dto.incidentId);
    if (existing) {
      existing.status = 'IN_REVIEW';
      existing.appealNotes = dto.justification;
    }

    try {
      await this.prisma.marketplaceTrustIncident.update({
        where: { id: dto.incidentId },
        data: {
          status: 'IN_REVIEW',
          appealNotes: dto.justification,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Could not update appeal in database: ${err?.message}`);
    }

    this.logger.log(`Appeal filed for incident ${dto.incidentId} by user ${dto.appellantId}`);
    return {
      incidentId: dto.incidentId,
      appellantId: dto.appellantId,
      status: 'APPEAL_PENDING_REVIEW',
      submittedAt: new Date(),
    };
  }

  /**
   * Retrieves active incidents in the human moderation queue.
   */
  async getModerationQueue(tenantId: string = 'GLOBAL', limit = 50): Promise<any[]> {
    try {
      const records = await this.prisma.marketplaceTrustIncident.findMany({
        where: {
          tenantId,
          status: 'IN_REVIEW',
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      if (records && records.length > 0) return records;
    } catch {
      // fallback to memory
    }

    return Array.from(this.inMemoryIncidents.values())
      .filter((inc) => inc.status === 'IN_REVIEW')
      .slice(0, limit);
  }
}
