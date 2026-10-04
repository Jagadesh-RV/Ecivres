import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AnomalyRuleService } from './services/anomaly-rule.service';
import { AnomalyEventService } from './services/anomaly-event.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AnomalySeverityDto } from './dto/detect-anomaly.dto';

describe('AnomalyDetectionModule Services', () => {
  let ruleService: AnomalyRuleService;
  let eventService: AnomalyEventService;
  let detectionService: AnomalyDetectionService;

  const mockPrismaService = {
    anomaly: {
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'ano_1', ...args.data })),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnomalyRuleService,
        AnomalyEventService,
        AnomalyDetectionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    ruleService = module.get<AnomalyRuleService>(AnomalyRuleService);
    eventService = module.get<AnomalyEventService>(AnomalyEventService);
    detectionService = module.get<AnomalyDetectionService>(AnomalyDetectionService);
  });

  it('should evaluate telemetry spikes correctly', () => {
    const result = ruleService.evaluateTelemetry({
      metricName: 'cancellations',
      currentValue: 150,
      baselineMean: 20,
      baselineStdDev: 5,
    });
    expect(result.isAnomaly).toBe(true);
    expect(result.severity).toBe(AnomalySeverityDto.CRITICAL);
  });

  it('should process anomaly telemetry and persist anomaly event', async () => {
    const res = await detectionService.processTelemetry({
      metricName: 'cancellations',
      currentValue: 150,
      baselineMean: 20,
      baselineStdDev: 5,
      region: 'us-east-1',
    });
    expect(res).toBeDefined();
    expect(res.id).toBe('ano_1');
  });

  it('should update anomaly status', async () => {
    const res = await eventService.updateStatus('ano_1', { status: 'RESOLVED' as any });
    expect(res.status).toBe('RESOLVED');
  });
});
