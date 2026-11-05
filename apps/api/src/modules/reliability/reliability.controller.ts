import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { Response } from 'express';
import { DependencyHealthService } from './dependency-health.service';
import { OperationalMetricsService } from './operational-metrics.service';
import { SloTrackerService } from './slo-tracker.service';
import { SelfHealingOrchestratorService } from './self-healing-orchestrator.service';
import { IncidentManagerService } from './incident-manager.service';
import {
  TriggerSelfHealingDto,
  CreateIncidentReportDto,
  RecordSloEventDto,
} from './dto/reliability.dto';

@Controller()
export class ReliabilityController {
  constructor(
    private readonly healthService: DependencyHealthService,
    private readonly metricsService: OperationalMetricsService,
    private readonly sloTracker: SloTrackerService,
    private readonly selfHealingOrchestrator: SelfHealingOrchestratorService,
    private readonly incidentManager: IncidentManagerService,
  ) {}

  /**
   * Fast Kubernetes / container liveness probe.
   * HTTP 200 OK when process is running and responsive.
   */
  @Get('health/live')
  async getLiveness() {
    return this.healthService.checkLiveness();
  }

  /**
   * Kubernetes readiness probe.
   * HTTP 200 when ready to accept traffic; HTTP 503 if critical dependencies are down.
   */
  @Get('health/ready')
  async getReadiness(@Res({ passthrough: true }) res: Response) {
    const report = await this.healthService.checkReadiness();
    if (report.status === 'NOT_READY') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      res.status(HttpStatus.OK);
    }
    return report;
  }

  /**
   * Deep dependency status (Database, External Adapters, Circuit Breakers, System Resources).
   * Redacts sensitive topology, hostnames, and credentials.
   */
  @Get('health/dependencies')
  async getDeepDependencies(@Res({ passthrough: true }) res: Response) {
    const report = await this.healthService.checkDeepDependencies();
    if (report.overallStatus === 'UNAVAILABLE') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      res.status(HttpStatus.OK);
    }
    return report;
  }

  /**
   * Operational metrics snapshot: request rate, error rate, p50/p95/p99 latency percentiles.
   */
  @Get('reliability/metrics')
  getMetrics() {
    return this.metricsService.getMetricsSnapshot();
  }

  /**
   * Service-Level Objective (SLO) snapshots and error budget burn rates.
   */
  @Get('reliability/slos')
  getSlos() {
    return {
      timestamp: new Date().toISOString(),
      slos: this.sloTracker.getAllSloSnapshots(),
    };
  }

  /**
   * Records a user or workflow transaction against its SLO.
   */
  @Post('reliability/slos/record')
  @HttpCode(HttpStatus.OK)
  async recordSloEvent(@Body() dto: RecordSloEventDto) {
    return this.sloTracker.recordWorkflowEvent(
      dto.workflowName,
      dto.durationMs,
      dto.success,
    );
  }

  /**
   * Dispatches a governed, bounded self-healing remediation.
   */
  @Post('reliability/self-healing/execute')
  async executeSelfHealing(@Body() dto: TriggerSelfHealingDto) {
    return this.selfHealingOrchestrator.executeSelfHealing(dto);
  }

  /**
   * Records a new operational incident (SEV1-SEV4).
   */
  @Post('reliability/incidents')
  async createIncident(@Body() dto: CreateIncidentReportDto) {
    return this.incidentManager.createIncident(dto);
  }

  /**
   * Lists active operational incidents.
   */
  @Get('reliability/incidents')
  getActiveIncidents() {
    return {
      timestamp: new Date().toISOString(),
      incidents: this.incidentManager.getActiveIncidents(),
    };
  }
}
