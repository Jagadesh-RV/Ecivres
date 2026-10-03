import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ProviderActivationService } from './services/provider-activation.service';
import { ProviderRetentionService } from './services/provider-retention.service';
import { ProviderHealthScoreService } from './services/provider-health-score.service';

@ApiTags('provider-lifecycle')
@Controller('provider-lifecycle')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProviderLifecycleController {
  constructor(
    private readonly activationService: ProviderActivationService,
    private readonly retentionService: ProviderRetentionService,
    private readonly healthScoreService: ProviderHealthScoreService,
  ) {}

  @Get('activation/:providerId')
  @ApiOperation({ summary: 'Get provider activation progress milestones' })
  async getActivation(@Param('providerId') providerId: string) {
    return this.activationService.getActivationProgress(providerId);
  }

  @Post('activation/milestone')
  @ApiOperation({ summary: 'Update provider activation milestone' })
  async updateMilestone(@Body() body: { providerId: string; milestone: any }) {
    return this.activationService.updateMilestone(body.providerId, body.milestone);
  }

  @Get('retention/:providerId')
  @ApiOperation({ summary: 'Get provider retention assessment & recommendations' })
  async getRetention(@Param('providerId') providerId: string, @Query('daysInactive') daysInactive?: string, @Query('cancellations') cancellations?: string) {
    return this.retentionService.assessChurnRisk(providerId, Number(daysInactive || 0), Number(cancellations || 0));
  }

  @Get('health-score/:providerId')
  @ApiOperation({ summary: 'Get provider health score & tier rating' })
  async getHealthScore(@Param('providerId') providerId: string, @Query('rating') rating?: string, @Query('responseRate') responseRate?: string, @Query('completionRate') completionRate?: string) {
    return this.healthScoreService.calculateHealthScore(providerId, Number(rating || 4.8), Number(responseRate || 95), Number(completionRate || 98));
  }
}
