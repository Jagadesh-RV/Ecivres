import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { PredictiveMaintenanceService } from './services/predictive-maintenance.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PredictiveMaintenanceService', () => {
  let service: PredictiveMaintenanceService;

  const mockPrisma = {
    smartHomeDevice: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictiveMaintenanceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PredictiveMaintenanceService>(PredictiveMaintenanceService);
  });

  it('should register smart home device successfully', async () => {
    mockPrisma.smartHomeDevice.create.mockResolvedValue({
      smartDeviceId: 'dev_1',
      homeId: 'home_1',
      deviceType: 'HVAC',
      lastStatus: 'HEALTHY',
    });

    const res = await service.registerDevice('home_1', 'HVAC', 'topic/hvac');
    expect(res.smartDeviceId).toBe('dev_1');
  });
});
