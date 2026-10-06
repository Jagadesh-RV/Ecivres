import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureEngineeringService } from './services/feature-engineering.service';
import { DemandFeaturesService } from './services/demand-features.service';
import { SupplyFeaturesService } from './services/supply-features.service';
import { FinancialFeaturesService } from './services/financial-features.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FeatureEngineeringService', () => {
  let service: FeatureEngineeringService;

  const mockPrisma = {
    booking: {
      count: jest.fn().mockResolvedValue(100),
    },
    providerProfile: {
      count: jest.fn().mockResolvedValue(25),
    },
    payment: {
      aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 5000 }, _count: { id: 50 } }),
      count: jest.fn().mockResolvedValue(2),
    },
    decisionContextRecord: {
      create: jest.fn().mockResolvedValue({ id: 'ctx-123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureEngineeringService,
        DemandFeaturesService,
        SupplyFeaturesService,
        FinancialFeaturesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FeatureEngineeringService>(FeatureEngineeringService);
  });

  it('should extract marketplace feature set cleanly', async () => {
    const features = await service.extractMarketplaceFeatures({ region: 'GLOBAL' });
    expect(features).toBeDefined();
    expect(features.correlationId).toBeDefined();
    expect(features.demand.bookingsCount).toBe(100);
    expect(features.supply.activeProvidersCount).toBe(25);
    expect(features.financial.gmvAmount).toBe(5000);
    expect(features.overallMarketRiskScore).toBeGreaterThanOrEqual(0);
  });
});
