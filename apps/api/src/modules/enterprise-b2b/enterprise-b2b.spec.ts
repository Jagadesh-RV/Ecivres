import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseOrganizationService } from './services/enterprise-organization.service';
import { CustomRateCardService } from './services/custom-rate-card.service';
import { PurchaseOrderBillingService } from './services/purchase-order-billing.service';

describe('EnterpriseB2bModule Services', () => {
  let orgService: EnterpriseOrganizationService;
  let rateCardService: CustomRateCardService;
  let poBillingService: PurchaseOrderBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseOrganizationService, CustomRateCardService, PurchaseOrderBillingService],
    }).compile();

    orgService = module.get<EnterpriseOrganizationService>(EnterpriseOrganizationService);
    rateCardService = module.get<CustomRateCardService>(CustomRateCardService);
    poBillingService = module.get<PurchaseOrderBillingService>(PurchaseOrderBillingService);
  });

  it('should create enterprise org with custom net terms', async () => {
    const org = await orgService.createOrganization('Acme Corp', undefined, 60, 5000);
    expect(org.netTermsDays).toBe(60);
    expect(org.approvalThresholdUsd).toBe(5000);
  });

  it('should calculate custom negotiated price rate cards', () => {
    rateCardService.setNegotiatedRate('org_1', 'cat_hvac', 15);
    const quote = rateCardService.calculateNegotiatedPrice('org_1', 'cat_hvac', 200);
    expect(quote.discountPct).toBe(15);
    expect(quote.finalPrice).toBe(170);
  });

  it('should flag PO invoice for approval when amount exceeds threshold', async () => {
    const org = await orgService.createOrganization('Tech Global', undefined, 30, 1000);
    const invoice = await poBillingService.createPurchaseOrderInvoice(org.id, 'PO-998822', 2500);
    expect(invoice.status).toBe('PENDING_APPROVAL');
  });
});
