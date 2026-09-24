import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RollbackEngineService } from './services/rollback-engine.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RollbackEngineService', () => {
  let service: RollbackEngineService;

  const mockPrisma = {
    deploymentSnapshot: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    operationsIncident: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RollbackEngineService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RollbackEngineService>(RollbackEngineService);
  });

  it('should create pre-deployment baseline snapshot', async () => {
    mockPrisma.deploymentSnapshot.create.mockResolvedValue({
      snapshotId: 'snp_1',
      releaseVersion: 'v8.1.0',
      activeStatus: 'STABLE_BASELINE',
    });

    const res = await service.createDeploymentSnapshot('v8.1.0', 'sha256:abc');
    expect(res.snapshotId).toBe('snp_1');
    expect(res.releaseVersion).toBe('v8.1.0');
  });

  it('should restore to previous stable release snapshot', async () => {
    mockPrisma.deploymentSnapshot.findFirst.mockResolvedValue({
      snapshotId: 'snp_baseline_1',
      releaseVersion: 'v8.1.0',
    });

    const res = await service.restorePreviousRelease('v8.2.0-failed');
    expect(res.targetVersion).toBe('v8.1.0');
    expect(res.restorationStatus).toBe('RESTORED');
  });
});
