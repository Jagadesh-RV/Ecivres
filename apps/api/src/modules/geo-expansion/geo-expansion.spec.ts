import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { GeographicExpansionService } from './services/geographic-expansion.service';
import { LocalizationConfigService } from './services/localization-config.service';
import { CrossBorderMarketplaceService } from './services/cross-border-marketplace.service';

describe('GeoExpansionModule Services', () => {
  let geoService: GeographicExpansionService;
  let locService: LocalizationConfigService;
  let crossBorderService: CrossBorderMarketplaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeographicExpansionService, LocalizationConfigService, CrossBorderMarketplaceService],
    }).compile();

    geoService = module.get<GeographicExpansionService>(GeographicExpansionService);
    locService = module.get<LocalizationConfigService>(LocalizationConfigService);
    crossBorderService = module.get<CrossBorderMarketplaceService>(CrossBorderMarketplaceService);
  });

  it('should list active expansion zones and match postal code lookup', async () => {
    const zones = await geoService.getActiveZones();
    expect(zones.length).toBeGreaterThan(0);

    const found = await geoService.getZoneByPostalCode('10001');
    expect(found).not.toBeNull();
    expect(found?.cityName).toBe('New York City');
  });

  it('should resolve regional currency, tax rate, and language configuration', () => {
    const uk = locService.getRegionalConfig('GB');
    expect(uk.currency).toBe('GBP');
    expect(uk.defaultTaxRatePct).toBe(20.0);

    const ca = locService.getRegionalConfig('CA');
    expect(ca.currency).toBe('CAD');
    expect(ca.taxName).toBe('HST');
  });

  it('should calculate cross border FX conversion and deduct FX fee', () => {
    const settlement = crossBorderService.calculateCrossBorderSettlement(100, 'USD', 'EUR');
    expect(settlement.targetAmount).toBe(92);
    expect(settlement.fxFeePct).toBe(1.5);
    expect(settlement.netSettlementAmount).toBeLessThan(92);
  });
});
