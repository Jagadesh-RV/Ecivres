import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { EdgeInferenceService } from './services/edge-inference.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('EdgeInferenceService', () => {
  let service: EdgeInferenceService;

  const mockPrisma = {
    edgeInferenceCache: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeInferenceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EdgeInferenceService>(EdgeInferenceService);
  });

  it('should run sub-10ms edge inference', async () => {
    const res = await service.runOfflineInference('eu-central-1', 'rec-v1');
    expect(res.region).toBe('eu-central-1');
    expect(res.latencyMs).toBeLessThan(10);
  });
});
