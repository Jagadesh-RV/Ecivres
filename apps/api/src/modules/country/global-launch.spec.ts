import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RegionalConfigService } from './services/regional-config.service';
import { DynamicLanguageLoaderService } from '../i18n/services/dynamic-language-loader.service';
import { GlobalPaymentRouterService } from '../payments-global/services/global-payment-router.service';
import { RegionalTaxCalculatorService } from '../tax-global/services/regional-tax-calculator.service';
import { RegionalKycRulesService } from '../verification-global/services/regional-kyc-rules.service';
import { TimezoneSchedulerService } from '../dispatch-global/services/timezone-scheduler.service';

describe('Global Launch Integration Suite', () => {
  let regionalConfig: RegionalConfigService;
  let i18nLoader: DynamicLanguageLoaderService;
  let paymentRouter: GlobalPaymentRouterService;
  let taxCalculator: RegionalTaxCalculatorService;
  let kycRules: RegionalKycRulesService;
  let timezoneScheduler: TimezoneSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionalConfigService,
        DynamicLanguageLoaderService,
        GlobalPaymentRouterService,
        RegionalTaxCalculatorService,
        RegionalKycRulesService,
        TimezoneSchedulerService,
      ],
    }).compile();

    regionalConfig = module.get<RegionalConfigService>(RegionalConfigService);
    i18nLoader = module.get<DynamicLanguageLoaderService>(DynamicLanguageLoaderService);
    paymentRouter = module.get<GlobalPaymentRouterService>(GlobalPaymentRouterService);
    taxCalculator = module.get<RegionalTaxCalculatorService>(RegionalTaxCalculatorService);
    kycRules = module.get<RegionalKycRulesService>(RegionalKycRulesService);
    timezoneScheduler = module.get<TimezoneSchedulerService>(TimezoneSchedulerService);
  });

  it('should end-to-end validate Indian marketplace setup (IN / INR / Hindi / Razorpay / GST / Aadhaar / IST)', () => {
    const config = regionalConfig.getRegionalConfig('IN');
    expect(config.currency).toBe('INR');

    const i18n = i18nLoader.getTranslations('hi');
    expect(i18n.welcome).toBeDefined();

    const gateway = paymentRouter.selectOptimalPaymentGateway('IN', 'INR', 'UPI');
    expect(gateway).toBe('RAZORPAY');

    const tax = taxCalculator.calculateTax(1000, 'GST', 18);
    expect(tax.taxAmount).toBe(180);

    const rules = kycRules.getRequiredKycDocuments('IN');
    expect(rules.map((r) => r.docType)).toContain('AADHAAR');

    const tz = timezoneScheduler.getCountryTimezone('IN');
    expect(tz).toBe('Asia/Kolkata');
  });
});
