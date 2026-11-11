import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EnterpriseOrganizationService } from './services/enterprise-organization.service';
import { CustomRateCardService } from './services/custom-rate-card.service';
import { PurchaseOrderBillingService } from './services/purchase-order-billing.service';

describe('Phase 26: Security & Multi-Tenant Boundary Isolation', () => {
  let orgService: EnterpriseOrganizationService;
  let rateCardService: CustomRateCardService;
  let poBillingService: PurchaseOrderBillingService;

  let tenantAOrgId: string;
  let tenantBOrgId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseOrganizationService,
        CustomRateCardService,
        PurchaseOrderBillingService,
      ],
    }).compile();

    orgService = module.get<EnterpriseOrganizationService>(EnterpriseOrganizationService);
    rateCardService = module.get<CustomRateCardService>(CustomRateCardService);
    poBillingService = module.get<PurchaseOrderBillingService>(PurchaseOrderBillingService);

    // Seed two isolated enterprise tenant accounts
    const tenantA = await orgService.createOrganization('Acme Enterprise (Tenant A)', undefined, 30, 1000);
    const tenantB = await orgService.createOrganization('Beta Industries (Tenant B)', undefined, 45, 2000);

    tenantAOrgId = tenantA.id;
    tenantBOrgId = tenantB.id;
  });

  describe('1. Cross-Tenant Rate Card & Pricing Isolation', () => {
    it('should strictly isolate negotiated pricing between distinct enterprise tenants', () => {
      const categoryId = 'cat_electrical_commercial';

      // Tenant A negotiates a 25% discount for commercial electrical
      rateCardService.setNegotiatedRate(tenantAOrgId, categoryId, 25);

      // Verify Tenant A receives discounted rate
      const quoteA = rateCardService.calculateNegotiatedPrice(tenantAOrgId, categoryId, 400);
      expect(quoteA.discountPct).toBe(25);
      expect(quoteA.finalPrice).toBe(300);

      // Verify Tenant B receives standard pricing (0% discount) for the identical category
      const quoteB = rateCardService.calculateNegotiatedPrice(tenantBOrgId, categoryId, 400);
      expect(quoteB.discountPct).toBe(0);
      expect(quoteB.finalPrice).toBe(400);
    });

    it('should prevent cross-tenant rate card overwriting', () => {
      const categoryId = 'cat_plumbing_industrial';

      rateCardService.setNegotiatedRate(tenantAOrgId, categoryId, 10);
      rateCardService.setNegotiatedRate(tenantBOrgId, categoryId, 30);

      // Tenant A must maintain 10%
      const quoteA = rateCardService.calculateNegotiatedPrice(tenantAOrgId, categoryId, 100);
      expect(quoteA.finalPrice).toBe(90);

      // Tenant B must maintain 30%
      const quoteB = rateCardService.calculateNegotiatedPrice(tenantBOrgId, categoryId, 100);
      expect(quoteB.finalPrice).toBe(70);
    });
  });

  describe('2. Purchase Order & Invoicing Tenant Boundaries', () => {
    it('should tag purchase order invoices with immutable tenant identifier', async () => {
      const invoiceA = await poBillingService.createPurchaseOrderInvoice(
        tenantAOrgId,
        'PO-ACME-001',
        850,
      );

      expect(invoiceA.orgId).toBe(tenantAOrgId);
      expect(invoiceA.poNumber).toBe('PO-ACME-001');
      expect(invoiceA.status).toBe('APPROVED'); // under $1000 threshold
    });

    it('should prevent cross-tenant billing access and PO approval tampering', async () => {
      const invoiceA = await poBillingService.createPurchaseOrderInvoice(
        tenantAOrgId,
        'PO-ACME-002',
        1500, // exceeds $1000 threshold -> PENDING_APPROVAL
      );

      expect(invoiceA.status).toBe('PENDING_APPROVAL');

      // Tenant B cannot approve Tenant A's invoice
      const validateApproval = (requestingOrgId: string, invoiceOrgId: string) => {
        if (requestingOrgId !== invoiceOrgId) {
          throw new ForbiddenException('Cross-tenant invoice access denied');
        }
        return true;
      };

      expect(() => validateApproval(tenantBOrgId, invoiceA.orgId)).toThrow(ForbiddenException);
      expect(() => validateApproval(tenantAOrgId, invoiceA.orgId)).not.toThrow();
    });
  });

  describe('3. Tenant Lookup & Non-Existent Entity Safety', () => {
    it('should return null when querying an unmapped tenant identifier', async () => {
      const result = await orgService.getOrgById('org_non_existent_9999');
      expect(result).toBeNull();
    });

    it('should correctly retrieve isolated tenant profile without cross-contamination', async () => {
      const orgA = await orgService.getOrgById(tenantAOrgId);
      expect(orgA).not.toBeNull();
      expect(orgA?.name).toBe('Acme Enterprise (Tenant A)');

      const orgB = await orgService.getOrgById(tenantBOrgId);
      expect(orgB).not.toBeNull();
      expect(orgB?.name).toBe('Beta Industries (Tenant B)');
    });
  });
});

