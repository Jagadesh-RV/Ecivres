import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { K8sSelfHealingService } from './services/k8s-self-healing.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('K8sSelfHealingService', () => {
  let service: K8sSelfHealingService;

  const mockPrisma = {
    autonomousRecoveryAction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        K8sSelfHealingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<K8sSelfHealingService>(K8sSelfHealingService);
  });

  it('should trigger recovery action successfully', async () => {
    mockPrisma.autonomousRecoveryAction.create.mockResolvedValue({
      actionId: 'rec_1',
      clusterName: 'k8s-prod',
      targetDeployment: 'api-service',
      status: 'SUCCESS',
    });

    const res = await service.triggerRecovery('k8s-prod', 'api-service', 'Memory Leak');
    expect(res.actionId).toBe('rec_1');
    expect(res.status).toBe('SUCCESS');
  });
});
