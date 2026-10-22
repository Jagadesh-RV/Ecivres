import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OutcomeMeasurementService, OutcomeMeasurementResult } from './outcome-measurement.service';

export type BusinessEffectiveness =
  | 'UNKNOWN'
  | 'SUCCESSFUL'
  | 'PARTIALLY_SUCCESSFUL'
  | 'INEFFECTIVE'
  | 'FAILED'
  | 'HARMFUL'
  | 'INCONCLUSIVE';

export interface DecisionEvaluationRequest {
  decisionId: string;
  executionId: string;
  executionStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  interventionCost?: number;
  measuredGmvImpact?: number;
  unintendedNegativeEffects?: string[];
}

export interface DecisionEffectivenessReport {
  id: string;
  decisionId: string;
  executionId: string;
  executionStatus: string;
  businessEffectiveness: BusinessEffectiveness;
  overallRoi: number;
  attributionScore: number;
  predictionAccuracyPct: number;
  evaluationSummary: string;
  repeatStrategyRecommendation: boolean;
  evaluatedAt: Date;
}

@Injectable()
export class DecisionEffectivenessService {
  private readonly logger = new Logger(DecisionEffectivenessService.name);
  private readonly evaluations = new Map<string, DecisionEffectivenessReport>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly outcomeMeasurement: OutcomeMeasurementService,
  ) {}

  async evaluateDecisionEffectiveness(req: DecisionEvaluationRequest): Promise<DecisionEffectivenessReport> {
    const outcomes = await this.outcomeMeasurement.getOutcomesByDecision(req.decisionId);

    // 1. Separate technical execution success from commercial success
    if (req.executionStatus === 'FAILED') {
      const failedReport: DecisionEffectivenessReport = {
        id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        decisionId: req.decisionId,
        executionId: req.executionId,
        executionStatus: 'FAILED',
        businessEffectiveness: 'FAILED',
        overallRoi: 0,
        attributionScore: 0,
        predictionAccuracyPct: 0,
        evaluationSummary: 'Action failed at technical execution stage. No positive market impact realized.',
        repeatStrategyRecommendation: false,
        evaluatedAt: new Date(),
      };
      this.evaluations.set(failedReport.id, failedReport);
      return failedReport;
    }

    // 2. Evaluate delta performance across measured outcomes
    let effectiveness: BusinessEffectiveness = 'INCONCLUSIVE';
    let totalAccuracy = 0;
    let avgDeltaPct = 0;

    if (outcomes.length > 0) {
      avgDeltaPct = outcomes.reduce((sum, o) => sum + o.deltaPercentage, 0) / outcomes.length;
      totalAccuracy = outcomes.reduce((sum, o) => {
        const errorPct = Math.min(100, Math.abs(o.deltaPercentage));
        return sum + (100 - errorPct);
      }, 0) / outcomes.length;

      if (req.unintendedNegativeEffects && req.unintendedNegativeEffects.length > 0) {
        effectiveness = 'HARMFUL';
      } else if (avgDeltaPct >= 0) {
        effectiveness = 'SUCCESSFUL';
      } else if (avgDeltaPct >= -15) {
        effectiveness = 'PARTIALLY_SUCCESSFUL';
      } else {
        effectiveness = 'INEFFECTIVE';
      }
    } else {
      effectiveness = 'INCONCLUSIVE';
    }

    // 3. Compute Decision ROI
    const cost = req.interventionCost || 100;
    const impactGmv = req.measuredGmvImpact !== undefined ? req.measuredGmvImpact : 150;
    const overallRoi = cost > 0 ? Number((((impactGmv - cost) / cost) * 100).toFixed(2)) : 0;

    const repeatStrategy = effectiveness === 'SUCCESSFUL' || (effectiveness === 'PARTIALLY_SUCCESSFUL' && overallRoi > 0);

    const evalId = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const summary = `Evaluation: Business outcome is ${effectiveness}. Prediction accuracy: ${totalAccuracy.toFixed(1)}%, ROI: ${overallRoi}%. ${
      repeatStrategy ? 'Strategy is validated for future recurrence.' : 'Strategy underperformed expectations or caused adverse side effects.'
    }`;

    const report: DecisionEffectivenessReport = {
      id: evalId,
      decisionId: req.decisionId,
      executionId: req.executionId,
      executionStatus: req.executionStatus,
      businessEffectiveness: effectiveness,
      overallRoi,
      attributionScore: Number((Math.max(0.5, totalAccuracy / 100)).toFixed(2)),
      predictionAccuracyPct: Number(totalAccuracy.toFixed(2)),
      evaluationSummary: summary,
      repeatStrategyRecommendation: repeatStrategy,
      evaluatedAt: new Date(),
    };

    this.evaluations.set(evalId, report);

    try {
      await this.prisma.decisionEffectivenessLog.create({
        data: {
          id: evalId,
          decisionId: req.decisionId,
          executionId: req.executionId,
          executionStatus: req.executionStatus,
          businessEffectiveness: effectiveness,
          overallRoi,
          attributionScore: report.attributionScore,
          evaluationSummary: summary,
          evaluatedAt: report.evaluatedAt,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed writing decision effectiveness to database: ${err.message}`);
    }

    this.logger.log(`Evaluated decision ${req.decisionId}: Execution=${req.executionStatus}, Effectiveness=${effectiveness}, ROI=${overallRoi}%`);
    return report;
  }

  async getEvaluation(evaluationId: string): Promise<DecisionEffectivenessReport | undefined> {
    return this.evaluations.get(evaluationId);
  }
}
