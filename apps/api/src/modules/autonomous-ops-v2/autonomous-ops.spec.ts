import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { PredictiveScalingService } from './services/predictive-scaling.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PredictiveScalingService', () => {
  let service: PredictiveScalingService;

  const mockPrisma = {
    opsScalingAction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictiveScalingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PredictiveScalingService>(PredictiveScalingService);
  });

  it('should trigger predictive scale successfully', async () => {
    mockPrisma.opsScalingAction.create.mockResolvedValue({
      scalingId: 'scale_1',
      clusterId: 'cluster_1',
      targetReplicas: 8,
      triggerMetric: 'HIGH_CPU',
    });

    const res = await service.triggerPredictiveScale('cluster_1', 8, 'HIGH_CPU');
    expect(res.scalingId).toBe('scale_1');
    expect(res.targetReplicas).toBe(8);
  });
});
