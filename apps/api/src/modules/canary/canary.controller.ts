import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CanaryMetricsMonitorService } from './services/canary-metrics-monitor.service';

@ApiTags('canary')
@Controller('canary')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CanaryController {
  constructor(private readonly canaryService: CanaryMetricsMonitorService) {}

  @Post('evaluate-rollback')
  @ApiOperation({ summary: 'Evaluate canary metrics for automatic rollback trigger' })
  async evaluateRollback(@Body() body: { canaryVersion: string; errorRatePercent: number; p95LatencyMs: number }) {
    return this.canaryService.evaluateAutomaticRollback(body.canaryVersion, body.errorRatePercent, body.p95LatencyMs);
  }

  @Post('update-weight')
  @ApiOperation({ summary: 'Update canary progressive traffic weight percentage' })
  async updateWeight(@Body() body: { canaryVersion: string; targetWeightPercent: number }) {
    return this.canaryService.updateTrafficWeight(body.canaryVersion, body.targetWeightPercent);
  }
}
