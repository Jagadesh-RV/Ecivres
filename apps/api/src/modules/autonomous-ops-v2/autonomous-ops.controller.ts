import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PredictiveScalingService } from './services/predictive-scaling.service';
import { TriggerPredictiveScaleDto } from './dto/trigger-predictive-scale.dto';

@ApiTags('autonomous-ops-v2')
@Controller('autonomous-ops-v2')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AutonomousOpsController {
  constructor(private readonly scalingService: PredictiveScalingService) {}

  @Post('scaling/predictive')
  @ApiOperation({ summary: 'Trigger AI predictive infrastructure cluster scaling' })
  async triggerPredictiveScale(@Body() dto: TriggerPredictiveScaleDto) {
    return this.scalingService.triggerPredictiveScale(dto.clusterId, dto.targetReplicas, dto.triggerMetric);
  }

  @Get('clusters/:id/cost-optimization')
  @ApiOperation({ summary: 'Get AI cloud infrastructure cost optimization recommendations' })
  async getCostRecommendations(@Param('id') id: string) {
    return this.scalingService.getCostOptimizationRecommendations(id);
  }
}
