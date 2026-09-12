import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceIntelligenceService } from './marketplace-intelligence.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MarketplaceIntelligenceService', () => {
  let service: MarketplaceIntelligenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceIntelligenceService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<MarketplaceIntelligenceService>(MarketplaceIntelligenceService);
  });

  it('should return demand heatmaps and zip code intensity', async () => {
    const heatmaps = await service.getDemandHeatmap();
    expect(heatmaps.length).toBeGreaterThan(0);
    expect(heatmaps[0].demandIntensity).toBeGreaterThan(0);
  });

  it('should compute conversion funnel metrics and provider health index', async () => {
    const funnel = await service.getConversionFunnel();
    expect(funnel.overallConversionRate).toBeGreaterThan(0);
    expect(funnel.bookingCompleted).toBeLessThan(funnel.totalVisitors);

    const health = await service.getProviderHealthIndex();
    expect(health.totalActiveProviders).toBeGreaterThan(0);
    expect(health.providerRetentionRateMonth3).toBeGreaterThan(50);
  });
});
