import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelService } from './whitelabel.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('WhiteLabelService', () => {
  let service: WhiteLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhiteLabelService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<WhiteLabelService>(WhiteLabelService);
  });

  it('should configure custom white label tenant branding and feature flags', async () => {
    const config = await service.setTenantConfig({
      tenantId: 'tenant_urban',
      brandName: 'Urban Fix Pro',
      logoUrl: 'https://urbanfix.com/logo.png',
      customDomain: 'services.urbanfix.com',
      themeColors: { primaryHex: '#059669', secondaryHex: '#047857', bgHex: '#064E3B' },
      emailBranding: { senderName: 'Urban Fix', footerText: 'Urban Fix Inc.' },
      featureToggles: {
        enableArPreview: false,
        enableSplitPayments: true,
        enableGamification: true,
      },
    });

    expect(config.brandName).toBe('Urban Fix Pro');
    expect(config.domainVerified).toBe(true);

    const fetchedByDomain = await service.getTenantByDomain('services.urbanfix.com');
    expect(fetchedByDomain?.tenantId).toBe('tenant_urban');
  });
});
