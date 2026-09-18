import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { RepairEstimateService } from './repair-estimate.service';
import { DirectBillingService } from './direct-billing.service';
import { ClaimType } from './dto/create-claim.dto';

describe('Insurance Module Services', () => {
  let claimsService: ClaimsService;
  let repairEstimate: RepairEstimateService;
  let directBilling: DirectBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimsService, RepairEstimateService, DirectBillingService],
    }).compile();

    claimsService = module.get<ClaimsService>(ClaimsService);
    repairEstimate = module.get<RepairEstimateService>(RepairEstimateService);
    directBilling = module.get<DirectBillingService>(DirectBillingService);
  });

  it('should file insurance claim and compute net covered amount', async () => {
    const res = await claimsService.fileClaim({
      policyNumber: 'POL-10099',
      policyHolderId: 'cust_88',
      bookingId: 'bk_200',
      claimType: ClaimType.PROPERTY_DAMAGE,
      estimatedDamageUsd: 1500,
    });
    expect(res.claimId).toBeDefined();
    expect(res.deductibleUsd).toBe(250);
    expect(res.coveredAmountUsd).toBe(1250);
    expect(res.status).toBe('UNDER_REVIEW');
  });

  it('should calculate repair labor and materials estimate total', async () => {
    const res = await repairEstimate.calculateEstimate({
      claimId: 'clm_100',
      items: [
        { itemDescription: 'Pipe Replacement', laborHours: 4, materialsCostUsd: 200 },
        { itemDescription: 'Drywall Repair', laborHours: 2, materialsCostUsd: 100 },
      ],
    });
    // labor: 6 hours * $85 = $510, materials: $300 -> grand total: $810
    expect(res.totalLaborCostUsd).toBe(510);
    expect(res.totalMaterialsCostUsd).toBe(300);
    expect(res.grandTotalUsd).toBe(810);
  });

  it('should process direct billing settlement', async () => {
    const res = await directBilling.processDirectBilling('clm_100', 'INS_ALLSTATE', 810);
    expect(res.settlementStatus).toBe('PAID');
    expect(res.approvedPayoutUsd).toBe(810);
  });
});
