import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GraphBuilderService } from './services/graph-builder.service';
import { AddGraphEdgeDto } from './dto/add-graph-edge.dto';

@ApiTags('knowledge-graph')
@Controller('knowledge-graph')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KnowledgeGraphController {
  constructor(private readonly graphService: GraphBuilderService) {}

  @Post('edges')
  @ApiOperation({ summary: 'Add knowledge graph relationship edge' })
  async addEdge(@Body() dto: AddGraphEdgeDto) {
    return this.graphService.addEdge(dto.sourceEntity, dto.targetEntity, dto.relationship, dto.weight);
  }

  @Get('entities/:sourceId/related')
  @ApiOperation({ summary: 'Get related entities from commerce knowledge graph' })
  async getRelated(@Param('sourceId') sourceId: string) {
    return this.graphService.getRelatedEntities(sourceId);
  }
}
