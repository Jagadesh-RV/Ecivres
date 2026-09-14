import { Test, TestingModule } from '@nestjs/testing';
import { RoutineSchedulerService } from './routine-scheduler.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RoutineSchedulerService', () => {
  let service: RoutineSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutineSchedulerService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<RoutineSchedulerService>(RoutineSchedulerService);
  });

  it('should create recurring routine booking schedule and calculate next date', async () => {
    const routine = await service.createRoutineSchedule('cust_100', 'srv_clean_1', 'Bi-weekly House Cleaning', 14);
    expect(routine.serviceName).toBe('Bi-weekly House Cleaning');
    expect(routine.autoRebookEnabled).toBe(true);

    const list = await service.getCustomerRoutines('cust_100');
    expect(list.length).toBe(1);
  });
});
