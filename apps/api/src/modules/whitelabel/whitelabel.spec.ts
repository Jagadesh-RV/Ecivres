import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { WhitelabelTenantService } from './services/whitelabel-tenant.service';
import { BrandThemeConfigService } from './services/brand-theme-config.service';
import { RevenueShareCalculatorService } from './services/revenue-share-calculator.service';

describe('WhitelabelModule Services', () => {
  let tenantService: WhitelabelTenantService;
  let themeService: BrandThemeConfigService;
  let revenueShareService: RevenueShareCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhitelabelTenantService, BrandThemeConfigService, RevenueShareCalculatorService],
    }).compile();

    tenantService = module.get<WhitelabelTenantService>(WhitelabelTenantService);
    themeService = module.get<BrandThemeConfigService>(BrandThemeConfigService);
    revenueShareService = module.get<RevenueShareCalculatorService>(RevenueShareCalculatorService);
  });

  it('should register whitelabel tenant partner and lookup by custom domain', async () => {
    await tenantService.createTenant('City Services Portal', 'services.city.gov', 10);
    const tenant = await tenantService.getTenantByDomain('services.city.gov');
    expect(tenant).not.toBeNull();
    expect(tenant?.partnerName).toBe('City Services Portal');
  });

  it('should configure custom brand theme styles and colors', () => {
    themeService.setTheme('wt_100', {
      logoUrl: 'https://city.gov/logo.png',
      primaryColorHex: '#10B981',
      secondaryColorHex: '#047857',
    });

    const theme = themeService.getTheme('wt_100');
    expect(theme.primaryColorHex).toBe('#10B981');
  });

  it('should calculate tenant revenue share payout correctly', () => {
    const share = revenueShareService.calculateTenantRevenueShare(10000, 15, 10);
    expect(share.grossCommissionUsd).toBe(1500);
    expect(share.tenantPayoutUsd).toBe(150);
    expect(share.platformNetRevenueUsd).toBe(1350);
  });
});
