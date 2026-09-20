import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { PriorityDispatchService } from './services/priority-dispatch.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PriorityDispatchService', () => {
  let service: PriorityDispatchService;

  const mockPrisma = {
    emergencySosBooking: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriorityDispatchService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PriorityDispatchService>(PriorityDispatchService);
  });

  it('should dispatch SOS booking with priority score 100', async () => {
    mockPrisma.emergencySosBooking.create.mockResolvedValue({
      sosId: 'sos_1',
      customerId: 'cust_1',
      serviceCategory: 'PLUMBING_FLOOD',
      priorityScore: 100,
      status: 'DISPATCHED',
    });

    const res = await service.dispatchSos('cust_1', 'PLUMBING_FLOOD', 37.77, -122.41);
    expect(res.sosId).toBe('sos_1');
    expect(res.priorityScore).toBe(100);
  });
});
