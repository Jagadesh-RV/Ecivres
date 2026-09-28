import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamicLanguageLoaderService } from './services/dynamic-language-loader.service';

describe('DynamicLanguageLoaderService', () => {
  let service: DynamicLanguageLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicLanguageLoaderService],
    }).compile();

    service = module.get<DynamicLanguageLoaderService>(DynamicLanguageLoaderService);
  });

  it('should load Hindi translations cleanly', () => {
    const dict = service.getTranslations('hi-IN');
    expect(dict.welcome).toBe('एसीवरेस में आपका स्वागत है');
  });

  it('should identify Arabic as RTL layout', () => {
    const rtl = service.evaluateRtlLayout('ar-AE');
    expect(rtl.isRtl).toBe(true);
    expect(rtl.direction).toBe('rtl');
  });

  it('should format currency correctly according to locale', () => {
    const formatted = service.formatLocalizedCurrency(1500, 'INR', 'en-IN');
    expect(formatted).toContain('1,500');
  });
});
