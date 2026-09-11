import { Test, TestingModule } from '@nestjs/testing';
import { InternationalizationService } from './internationalization.service';

describe('InternationalizationService', () => {
  let service: InternationalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternationalizationService],
    }).compile();

    service = module.get<InternationalizationService>(InternationalizationService);
  });

  it('should format currency and dates according to locale and timeZone', () => {
    const formattedCurrency = service.formatCurrency(125.5, {
      locale: 'en-US',
      currency: 'USD',
      timeZone: 'America/New_York',
    });
    expect(formattedCurrency).toContain('$125.50');

    const isRtl = service.isRtlLocale('ar-SA');
    expect(isRtl).toBe(true);
  });

  it('should generate GDPR data export package', async () => {
    const pkg = await service.generateGdprExportPackage('u100');
    expect(pkg.userId).toBe('u100');
    expect(pkg.personalData.gdprConsentGiven).toBe(true);
  });
});
