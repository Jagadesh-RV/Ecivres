import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OfflineIntelligenceService } from './services/offline-intelligence.service';
import { DispatchEdgeInferenceDto } from './dto/dispatch-edge-inference.dto';

@ApiTags('edge-ai-v2')
@Controller('edge-ai-v2')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EdgeAiController {
  constructor(private readonly edgeService: OfflineIntelligenceService) {}

  @Post('inferences')
  @ApiOperation({ summary: 'Dispatch offline sub-5ms Edge AI inference' })
  async dispatchInference(@Body() dto: DispatchEdgeInferenceDto) {
    return this.edgeService.dispatchInference(dto.edgeNodeId, dto.inputHash, dto.outputJson);
  }

  @Get('nodes/:id/latency')
  @ApiOperation({ summary: 'Get sub-5ms edge latency metrics for regional node' })
  async getLatencyMetrics(@Param('id') id: string) {
    return this.edgeService.getEdgeLatencyMetrics(id);
  }
}
