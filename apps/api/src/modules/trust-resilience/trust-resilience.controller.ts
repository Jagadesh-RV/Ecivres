import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MarketplaceTrustService } from './marketplace-trust.service';
import { DecisionExplainabilityService } from './decision-explainability.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { SelfHealingGuardService } from './self-healing-guard.service';
import { TrustResilienceMetricsService } from './trust-resilience-metrics.service';
import {
  DetectTrustRiskDto,
  ReviewIncidentDto,
  SubmitAppealDto,
  ExplainDecisionDto,
  TriggerRemediationWithGuardDto,
} from './dto/trust-resilience-dtos';

@ApiTags('Autonomous Marketplace Trust & Resilience (Phase 19)')
@Controller('api/v1/trust-resilience')
export class TrustResilienceController {
  constructor(
    private readonly trustService: MarketplaceTrustService,
    private readonly explainabilityService: DecisionExplainabilityService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly selfHealingGuardService: SelfHealingGuardService,
    private readonly metricsService: TrustResilienceMetricsService,
  ) {}

  @Post('trust/evaluate')
  @ApiOperation({ summary: 'Evaluate telemetry signals for marketplace trust and risk anomalies' })
  @ApiResponse({ status: 200, description: 'Trust risk evaluation generated successfully' })
  async evaluateTrustRisk(@Body() dto: DetectTrustRiskDto) {
    this.metricsService.incrementCounter('trust_evaluations_total', { incidentType: dto.incidentType });
    return this.trustService.evaluateTrustRisk(dto);
  }

  @Post('trust/review')
  @ApiOperation({ summary: 'Resolve a flagged trust incident via human moderator review' })
  @ApiResponse({ status: 200, description: 'Incident reviewed and status updated' })
  async reviewIncident(@Body() dto: ReviewIncidentDto) {
    this.metricsService.incrementCounter('trust_incident_reviews_total', { decision: dto.decision });
    return this.trustService.reviewIncident(dto);
  }

  @Post('trust/appeal')
  @ApiOperation({ summary: 'Submit an appeal against an automated risk flag or restriction' })
  @ApiResponse({ status: 200, description: 'Appeal registered for review' })
  async submitAppeal(@Body() dto: SubmitAppealDto) {
    this.metricsService.incrementCounter('trust_appeals_total');
    return this.trustService.submitAppeal(dto);
  }

  @Get('trust/queue')
  @ApiOperation({ summary: 'Fetch items in the human moderation queue' })
  async getModerationQueue(
    @Query('tenantId') tenantId: string = 'GLOBAL',
    @Query('limit') limit: number = 50,
  ) {
    return this.trustService.getModerationQueue(tenantId, limit);
  }

  @Post('explainability/record')
  @ApiOperation({ summary: 'Record and synthesize a business-readable explanation for an autonomous decision' })
  async recordExplanation(@Body() dto: ExplainDecisionDto) {
    this.metricsService.incrementCounter('decision_explanations_total', { policy: dto.policyApplied });
    return this.explainabilityService.recordDecisionExplanation(dto);
  }

  @Get('explainability/:decisionId')
  @ApiOperation({ summary: 'Retrieve the explanation and evidence signals for an autonomous decision' })
  async getExplanation(@Param('decisionId') decisionId: string) {
    return this.explainabilityService.getExplanation(decisionId);
  }

  @Get('resilience/circuit-breakers')
  @ApiOperation({ summary: 'Get snapshots of all registered circuit breakers' })
  async getCircuitBreakers() {
    return this.circuitBreakerService.getAllBreakerSnapshots();
  }

  @Post('resilience/circuit-breakers/reset')
  @ApiOperation({ summary: 'Manually reset a circuit breaker to CLOSED' })
  async resetCircuitBreaker(@Body('serviceName') serviceName: string) {
    this.circuitBreakerService.resetBreaker(serviceName);
    return { serviceName, status: 'RESET_TO_CLOSED' };
  }

  @Post('self-healing/guarded-remediate')
  @ApiOperation({ summary: 'Execute an autonomous self-healing remediation protected by loop breakers' })
  async executeGuardedRemediation(@Body() dto: TriggerRemediationWithGuardDto) {
    this.metricsService.incrementCounter('guarded_remediations_total', { actionType: dto.actionType });
    return this.selfHealingGuardService.executeGuardedRemediation(dto, async () => {
      // Mock operation executed within guard
      return { success: true, action: dto.actionType };
    });
  }

  @Get('health')
  @ApiOperation({ summary: 'Platform health check exposing liveness, readiness, and subsystem metrics' })
  async getHealth() {
    return this.metricsService.getSystemHealth();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Prometheus metrics endpoint for trust and resilience telemetry' })
  async getMetrics() {
    return this.metricsService.getPrometheusMetrics();
  }
}
