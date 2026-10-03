import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DistributedLockManagerService } from './services/distributed-lock-manager.service';
import { GatewayCircuitBreakerService } from './services/gateway-circuit-breaker.service';
import { PerformanceScalingMetricsService } from './services/performance-scaling-metrics.service';

@ApiTags('scaling')
@Controller('scaling')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScalingController {
  constructor(
    private readonly lockService: DistributedLockManagerService,
    private readonly breakerService: GatewayCircuitBreakerService,
    private readonly metricsService: PerformanceScalingMetricsService,
  ) {}

  @Post('acquire-lock')
  @ApiOperation({ summary: 'Acquire distributed lock for resource' })
  async acquireLock(@Body() body: { resourceKey: string; ttlMs?: number }) {
    const success = await this.lockService.acquireLock(body.resourceKey, body.ttlMs);
    return { resourceKey: body.resourceKey, acquired: success };
  }

  @Post('release-lock')
  @ApiOperation({ summary: 'Release distributed lock for resource' })
  async releaseLock(@Body() body: { resourceKey: string }) {
    const released = await this.lockService.releaseLock(body.resourceKey);
    return { resourceKey: body.resourceKey, released };
  }

  @Get('circuit-breaker')
  @ApiOperation({ summary: 'Get circuit breaker state for external service' })
  async getCircuitState(@Query('serviceName') serviceName: string) {
    const state = this.breakerService.getCircuitState(serviceName || 'payment-gateway');
    return { serviceName: serviceName || 'payment-gateway', state };
  }

  @Get('resilience-metrics')
  @ApiOperation({ summary: 'Get cluster resilience and scaling performance metrics' })
  async getMetrics() {
    return this.metricsService.getSystemResilienceStatus();
  }
}
