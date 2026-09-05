import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            findAllUsers: jest.fn().mockResolvedValue([]),
            verifyProvider: jest.fn().mockResolvedValue({ id: '1' }),
            getMarketplaceMonitoringMetrics: jest.fn().mockResolvedValue({ bookings: { total: 10 } }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getMarketplaceMonitoringMetrics on getMarketplaceMetrics endpoint', async () => {
    const res = await controller.getMarketplaceMetrics();
    expect(res.bookings.total).toBe(10);
  });
});

