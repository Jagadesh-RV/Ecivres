import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GraphBuilderService {
  private readonly logger = new Logger(GraphBuilderService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addEdge(sourceEntity: string, targetEntity: string, relationship: string, weight: number) {
    const edgeId = `edge_${Date.now()}`;
    this.logger.log(`Adding knowledge graph edge ${edgeId}: ${sourceEntity} -[${relationship}]-> ${targetEntity} (W: ${weight})`);
    return this.prisma.knowledgeGraphEdge.create({
      data: {
        edgeId,
        sourceEntity,
        targetEntity,
        relationship,
        weight,
      },
    });
  }

  async getRelatedEntities(sourceEntity: string) {
    this.logger.log(`Fetching graph relationships for entity ${sourceEntity}`);
    return this.prisma.knowledgeGraphEdge.findMany({
      where: { sourceEntity },
      orderBy: { weight: 'desc' },
    });
  }
}
