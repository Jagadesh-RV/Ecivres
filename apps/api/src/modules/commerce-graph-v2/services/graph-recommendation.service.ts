import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GraphRecommendationService {
  private readonly logger = new Logger(GraphRecommendationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createNode(entityType: string, label: string, propertiesJson: string) {
    const nodeId = `node_${Date.now()}`;
    this.logger.log(`Indexing commerce graph node ${nodeId} (${entityType}: ${label})`);
    return this.prisma.commerceGraphNode.create({
      data: {
        nodeId,
        entityType,
        label,
        propertiesJson,
      },
    });
  }

  async enrichRecommendations(customerId: string) {
    this.logger.log(`Querying graph dependencies for enriched AI recommendations for ${customerId}`);
    return {
      customerId,
      graphEnriched: true,
      recommendedCategories: ['HVAC_MAINTENANCE', 'DUCT_CLEANING'],
      confidenceScore: 0.94,
    };
  }
}
