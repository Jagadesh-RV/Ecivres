import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: {
            user: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn() },
            customerProfile: { count: jest.fn() },
            providerProfile: {
              findUnique: jest.fn().mockResolvedValue({ id: '1' }),
              update: jest.fn().mockResolvedValue({ id: '1' }),
              count: jest.fn(),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAdminDashboardStats', () => {
    it('should calculate platform metrics and revenue volume', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.user.count = jest.fn().mockResolvedValue(150);
      mockPrisma.customerProfile.count = jest.fn().mockResolvedValue(120);
      mockPrisma.providerProfile.count = jest.fn().mockResolvedValue(30);
      mockPrisma.booking = {
        count: jest.fn().mockResolvedValue(80),
        findMany: jest.fn().mockResolvedValue([
          { id: 'b-1', service: { price: 100 } },
          { id: 'b-2', service: { price: 250 } },
        ]),
      };
      mockPrisma.providerProfile.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.getAdminDashboardStats();

      expect(result.totalUsersCount).toEqual(150);
      expect(result.totalCustomersCount).toEqual(120);
      expect(result.platformGrossVolume).toEqual(350);
    });
  });

  describe('provider verification', () => {
    it('should approve provider profile', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.providerProfile.findUnique = jest.fn().mockResolvedValue({ id: 'p-1' });
      mockPrisma.providerProfile.update = jest.fn().mockResolvedValue({ id: 'p-1', isVerified: true });

      const result = await service.approveProvider('p-1');

      expect(result.isVerified).toBe(true);
      expect(mockPrisma.providerProfile.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { isVerified: true },
      });
    });
  });

  describe('Platform Audit & Revenue Breakdown', () => {
    it('should return system audit trail records', async () => {
      const logs = await service.getPlatformAuditLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].action).toBeDefined();
    });

    it('should return platform revenue breakdown calculation', async () => {
      jest.spyOn(service, 'getAdminDashboardStats').mockResolvedValue({
        platformGrossVolume: 1000,
      } as any);

      const breakdown = await service.getRevenueBreakdown();
      expect(breakdown.grossVolume).toBe(1000);
      expect(breakdown.platformCommission).toBe(100);
      expect(breakdown.providerPayouts).toBe(900);
    });

    it('should compute complete marketplace monitoring metrics breakdown', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.booking = {
        count: jest.fn().mockResolvedValue(10),
      };
      mockPrisma.service = { count: jest.fn().mockResolvedValue(5) };
      mockPrisma.providerProfile.count = jest.fn().mockResolvedValue(3);
      mockPrisma.customerProfile.count = jest.fn().mockResolvedValue(8);
      jest.spyOn(service, 'getRevenueBreakdown').mockResolvedValue({ grossVolume: 1000 } as any);

      const res = await service.getMarketplaceMonitoringMetrics();
      expect(res.bookings.total).toBe(10);
      expect(res.marketplace.totalServices).toBe(5);
    });
  });
});

