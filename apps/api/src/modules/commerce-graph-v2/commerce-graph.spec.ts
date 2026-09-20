import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphRecommendationService } from './services/graph-recommendation.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GraphRecommendationService', () => {
  let service: GraphRecommendationService;

  const mockPrisma = {
    commerceGraphNode: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphRecommendationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GraphRecommendationService>(GraphRecommendationService);
  });

  it('should create graph entity node successfully', async () => {
    mockPrisma.commerceGraphNode.create.mockResolvedValue({
      nodeId: 'node_1',
      entityType: 'SERVICE',
      label: 'Plumbing',
    });

    const res = await service.createNode('SERVICE', 'Plumbing', '{}');
    expect(res.nodeId).toBe('node_1');
  });
});
