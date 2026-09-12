import { Test, TestingModule } from '@nestjs/testing';
import { SmartOperationsService } from './smart-operations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SmartOperationsService', () => {
  let service: SmartOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartOperationsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SmartOperationsService>(SmartOperationsService);
  });

  it('should return SLO/SLA health metrics for core services', async () => {
    const health = await service.getSlaHealthDashboard();
    expect(health.length).toBe(3);
    expect(health[0].uptimePercentage).toBeGreaterThan(99);
    expect(health[0].p99LatencyMs).toBeGreaterThan(0);
  });

  it('should declare and list active major incidents', async () => {
    const incident = await service.declareIncident('Redis Cluster Failover', 'MAJOR', ['Redis', 'Cache']);
    expect(incident.severity).toBe('MAJOR');
    expect(incident.status).toBe('INVESTIGATING');

    const active = await service.getActiveIncidents();
    expect(active.length).toBe(1);
  });
});
