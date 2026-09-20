import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkforceForecasterService } from './services/workforce-forecaster.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('WorkforceForecasterService', () => {
  let service: WorkforceForecasterService;

  const mockPrisma = {
    workforceSchedule: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkforceForecasterService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkforceForecasterService>(WorkforceForecasterService);
  });

  it('should optimize workforce schedule', async () => {
    mockPrisma.workforceSchedule.create.mockResolvedValue({
      scheduleId: 'sched_1',
      organizationId: 'org_1',
      weekNumber: 40,
      aiOptimized: true,
    });

    const res = await service.optimizeSchedule('org_1', 40);
    expect(res.scheduleId).toBe('sched_1');
    expect(res.aiOptimized).toBe(true);
  });
});
