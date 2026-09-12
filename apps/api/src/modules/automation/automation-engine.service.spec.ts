import { Test, TestingModule } from '@nestjs/testing';
import { AutomationEngineService } from './automation-engine.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AutomationEngineService', () => {
  let service: AutomationEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationEngineService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AutomationEngineService>(AutomationEngineService);
  });

  it('should create automation rules and trigger actions when conditions match', async () => {
    await service.createRule({
      title: 'Auto-accept bookings under $150',
      trigger: 'BOOKING_CREATED',
      action: 'AUTO_ACCEPT',
      conditions: [{ field: 'amount', operator: 'LESS_THAN', value: 150 }],
      delayMinutes: 0,
      active: true,
    });

    const logs = await service.triggerEvent('BOOKING_CREATED', { amount: 120 });
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe('SUCCESS');
    expect(logs[0].details).toContain('AUTO_ACCEPT');
  });

  it('should skip rules when conditions are not met', async () => {
    await service.createRule({
      title: 'Auto-accept small bookings',
      trigger: 'BOOKING_CREATED',
      action: 'AUTO_ACCEPT',
      conditions: [{ field: 'amount', operator: 'LESS_THAN', value: 100 }],
      delayMinutes: 0,
      active: true,
    });

    const logs = await service.triggerEvent('BOOKING_CREATED', { amount: 250 });
    expect(logs[0].status).toBe('SKIPPED');
  });
});
