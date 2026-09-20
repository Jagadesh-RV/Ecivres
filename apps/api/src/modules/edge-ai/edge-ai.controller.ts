import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { EdgeInferenceService } from './services/edge-inference.service';
import { CacheEdgeModelDto } from './dto/cache-model.dto';

@ApiTags('edge-ai')
@Controller('edge-ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EdgeAiController {
  constructor(private readonly edgeAiService: EdgeInferenceService) {}

  @Post('cache')
  @ApiOperation({ summary: 'Sync AI model weight cache to regional Edge nodes' })
  async cacheModel(@Body() dto: CacheEdgeModelDto) {
    return this.edgeAiService.cacheModel(dto.region, dto.modelKey, dto.latencyMs);
  }

  @Get('inference')
  @ApiOperation({ summary: 'Run ultra-low latency sub-10ms regional Edge AI inference' })
  async runInference(@Query('region') region: string, @Query('modelKey') modelKey: string) {
    return this.edgeAiService.runOfflineInference(region || 'us-east-1', modelKey || 'default-v1');
  }
}
