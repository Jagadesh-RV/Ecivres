import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GraphRecommendationService } from './services/graph-recommendation.service';
import { CreateGraphNodeDto } from './dto/create-graph-node.dto';

@ApiTags('commerce-graph-v2')
@Controller('commerce-graph-v2')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommerceGraphController {
  constructor(private readonly graphService: GraphRecommendationService) {}

  @Post('nodes')
  @ApiOperation({ summary: 'Create commerce knowledge graph entity node' })
  async createNode(@Body() dto: CreateGraphNodeDto) {
    return this.graphService.createNode(dto.entityType, dto.label, dto.propertiesJson);
  }

  @Get('customers/:id/recommendations/enriched')
  @ApiOperation({ summary: 'Get graph-enriched AI recommendations for customer' })
  async getEnrichedRecommendations(@Param('id') id: string) {
    return this.graphService.enrichRecommendations(id);
  }
}
