import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MarketplaceOperationsService } from './services/marketplace-operations.service';

@ApiTags('operations')
@Controller('operations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OperationsController {
  constructor(private readonly opsService: MarketplaceOperationsService) {}

  @Post('incidents')
  @ApiOperation({ summary: 'Create live marketplace operations incident' })
  async createIncident(@Body() body: { title: string; description: string; severity?: string }) {
    return this.opsService.createIncident(body.title, body.description, body.severity);
  }

  @Get('sla-metrics')
  @ApiOperation({ summary: 'Get live SLA response & compliance metrics' })
  async getSlaMetrics() {
    return this.opsService.getSlaMetrics();
  }

  @Get('provider-health/:id')
  @ApiOperation({ summary: 'Check provider operational health' })
  async getProviderHealth(@Param('id') id: string) {
    return this.opsService.getProviderHealth(id);
  }

  @Get('queue-telemetry')
  @ApiOperation({ summary: 'Monitor BullMQ queue job telemetry' })
  async getQueueTelemetry() {
    return this.opsService.getQueueTelemetry();
  }
}
