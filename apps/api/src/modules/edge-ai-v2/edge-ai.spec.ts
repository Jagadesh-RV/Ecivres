import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { OfflineIntelligenceService } from './services/offline-intelligence.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OfflineIntelligenceService', () => {
  let service: OfflineIntelligenceService;

  const mockPrisma = {
    edgeOfflineInference: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfflineIntelligenceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OfflineIntelligenceService>(OfflineIntelligenceService);
  });

  it('should log offline edge inference with sub-5ms latency', async () => {
    mockPrisma.edgeOfflineInference.create.mockResolvedValue({
      inferenceId: 'inf_1',
      edgeNodeId: 'node_1',
      latencyMs: 4,
    });

    const res = await service.dispatchInference('node_1', 'hash_123', '{}');
    expect(res.inferenceId).toBe('inf_1');
    expect(res.latencyMs).toBe(4);
  });
});
