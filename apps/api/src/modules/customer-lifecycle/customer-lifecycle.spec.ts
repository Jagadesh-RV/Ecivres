import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLifecycleService } from './services/customer-lifecycle.service';
import { CustomerRetentionService } from './services/customer-retention.service';
import { CustomerReactivationService } from './services/customer-reactivation.service';

describe('CustomerLifecycleModule Services', () => {
  let lifecycleService: CustomerLifecycleService;
  let retentionService: CustomerRetentionService;
  let reactivationService: CustomerReactivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerLifecycleService, CustomerRetentionService, CustomerReactivationService],
    }).compile();

    lifecycleService = module.get<CustomerLifecycleService>(CustomerLifecycleService);
    retentionService = module.get<CustomerRetentionService>(CustomerRetentionService);
    reactivationService = module.get<CustomerReactivationService>(CustomerReactivationService);
  });

  it('should categorize customer into HIGH_VALUE or AT_RISK segments based on deterministic rules', () => {
    expect(lifecycleService.determineSegment(12, 1200, 10)).toBe('HIGH_VALUE');
    expect(lifecycleService.determineSegment(2, 200, 50)).toBe('AT_RISK');
    expect(lifecycleService.determineSegment(1, 50, 100)).toBe('DORMANT');
  });

  it('should generate retention promo offers for eligible opted-in users', () => {
    const offer = retentionService.generateRetentionOffer('user_csl_1', 'AT_RISK', true);
    expect(offer.eligible).toBe(true);
    expect(offer.promoCode).toBe('COMEBACK15');
  });

  it('should block retention offers if customer opted out of marketing', () => {
    const offer = retentionService.generateRetentionOffer('user_csl_2', 'AT_RISK', false);
    expect(offer.eligible).toBe(false);
  });

  it('should queue automated reactivation flow for dormant users', () => {
    const res = reactivationService.triggerReactivationCampaign('user_csl_3');
    expect(res.status).toBe('QUEUED');
  });
});
