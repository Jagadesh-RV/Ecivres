import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorService } from './health-indicator.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthIndicatorService', () => {
  let service: HealthIndicatorService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthIndicatorService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    service = module.get<HealthIndicatorService>(HealthIndicatorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return UP status when database query succeeds', async () => {
    const health = await service.checkHealth();
    expect(health.database).toBe('UP');
    expect(health.redis).toBe('UP');
    expect(health.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
