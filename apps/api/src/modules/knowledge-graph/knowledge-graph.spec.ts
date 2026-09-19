import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphBuilderService } from './services/graph-builder.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GraphBuilderService', () => {
  let service: GraphBuilderService;

  const mockPrisma = {
    knowledgeGraphEdge: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphBuilderService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GraphBuilderService>(GraphBuilderService);
  });

  it('should add relationship edge to graph', async () => {
    mockPrisma.knowledgeGraphEdge.create.mockResolvedValue({
      edgeId: 'edge_1',
      sourceEntity: 'srv_1',
      targetEntity: 'srv_2',
      relationship: 'RELATED',
      weight: 0.9,
    });

    const res = await service.addEdge('srv_1', 'srv_2', 'RELATED', 0.9);
    expect(res.edgeId).toBe('edge_1');
  });
});
