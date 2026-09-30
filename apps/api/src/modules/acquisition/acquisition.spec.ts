import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AcquisitionTrackingService } from './services/acquisition-tracking.service';
import { CampaignAttributionService } from './services/campaign-attribution.service';
import { CustomerActivationService } from './services/customer-activation.service';

describe('AcquisitionModule Services', () => {
  let trackingService: AcquisitionTrackingService;
  let attributionService: CampaignAttributionService;
  let activationService: CustomerActivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcquisitionTrackingService, CampaignAttributionService, CustomerActivationService],
    }).compile();

    trackingService = module.get<AcquisitionTrackingService>(AcquisitionTrackingService);
    attributionService = module.get<CampaignAttributionService>(CampaignAttributionService);
    activationService = module.get<CustomerActivationService>(CustomerActivationService);
  });

  it('should track user acquisition source and attribute channel', async () => {
    await trackingService.recordAcquisition({
      userId: 'user_acq_1',
      utmSource: 'google',
      utmCampaign: 'fall_promo',
      acquisitionCost: 12.5,
    });

    const attribution = await attributionService.attributeCustomerSource('user_acq_1');
    expect(attribution.channel).toBe('GOOGLE');
    expect(attribution.campaign).toBe('fall_promo');
    expect(attribution.cac).toBe(12.5);
  });

  it('should update customer activation progress milestones accurately', () => {
    let progress = activationService.getActivationStatus('user_acq_1');
    expect(progress.activationScorePercent).toBe(0);

    progress = activationService.updateMilestone('user_acq_1', 'hasCompletedProfile');
    expect(progress.activationScorePercent).toBe(25);

    progress = activationService.updateMilestone('user_acq_1', 'hasMadeFirstPayment');
    expect(progress.activationScorePercent).toBe(50);
  });
});
