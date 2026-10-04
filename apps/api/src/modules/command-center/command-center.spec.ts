import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceHealthService } from './services/marketplace-health.service';
import { MarketplaceAlertService } from './services/marketplace-alert.service';
import { MarketplaceCommandCenterService } from './services/marketplace-command-center.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommandCenterModule Services', () => {
  let commandCenterService: MarketplaceCommandCenterService;
  let healthService: MarketplaceHealthService;
  let alertService: MarketplaceAlertService;

  const mockPrismaService = {
    user: { count: jest.fn().mockResolvedValue(1500) },
    providerProfile: { count: jest.fn().mockResolvedValue(400) },
    booking: { count: jest.fn().mockResolvedValue(5000) },
    anomaly: { count: jest.fn().mockResolvedValue(2), findMany: jest.fn().mockResolvedValue([]) },
    approvalRequest: { count: jest.fn().mockResolvedValue(1) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceHealthService,
        MarketplaceAlertService,
        MarketplaceCommandCenterService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    commandCenterService = module.get<MarketplaceCommandCenterService>(MarketplaceCommandCenterService);
    healthService = module.get<MarketplaceHealthService>(MarketplaceHealthService);
    alertService = module.get<MarketplaceAlertService>(MarketplaceAlertService);
  });

  it('should calculate marketplace health metrics', async () => {
    const health = await healthService.getMarketplaceHealth();
    expect(health.activeCustomersCount).toBe(1500);
    expect(health.activeProvidersCount).toBe(400);
    expect(health.totalBookingsCount).toBe(5000);
  });

  it('should return operational health status', async () => {
    const op = await healthService.getOperationalHealth();
    expect(op.apiHealth).toBe('HEALTHY');
    expect(op.databaseHealth).toBe('HEALTHY');
  });

  it('should aggregate full command center state', async () => {
    const state = await commandCenterService.getFullCommandCenterState();
    expect(state.health.totalBookingsCount).toBe(5000);
    expect(state.intelligenceSummary.activeAnomaliesCount).toBe(2);
  });
});
