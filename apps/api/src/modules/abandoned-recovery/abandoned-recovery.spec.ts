import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AbandonedBookingService } from './services/abandoned-booking.service';
import { RecoveryCampaignService } from './services/recovery-campaign.service';

describe('AbandonedRecoveryModule Services', () => {
  let abandonedService: AbandonedBookingService;
  let campaignService: RecoveryCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbandonedBookingService, RecoveryCampaignService],
    }).compile();

    abandonedService = module.get<AbandonedBookingService>(AbandonedBookingService);
    campaignService = module.get<RecoveryCampaignService>(RecoveryCampaignService);
  });

  it('should record abandoned search/booking events', async () => {
    await abandonedService.recordAbandonedEvent('user_abn_1', 'PAYMENT', { serviceId: 'srv_123' });
    const events = await abandonedService.getUnrecoveredEvents('user_abn_1');
    expect(events.length).toBe(1);
    expect(events[0].eventType).toBe('PAYMENT');
  });

  it('should trigger recovery campaign with discount offer', async () => {
    await abandonedService.recordAbandonedEvent('user_abn_2', 'BOOKING_FORM', { serviceId: 'srv_456' });
    const res = await campaignService.triggerRecoveryCampaign('user_abn_2', true);
    expect(res.triggered).toBe(true);
    expect(res.targetEventType).toBe('BOOKING_FORM');
  });

  it('should enforce frequency cap window of 24h between recovery attempts', async () => {
    await abandonedService.recordAbandonedEvent('user_abn_3', 'PAYMENT');
    await campaignService.triggerRecoveryCampaign('user_abn_3', true);

    const secondTry = await campaignService.triggerRecoveryCampaign('user_abn_3', true);
    expect(secondTry.triggered).toBe(false);
    expect(secondTry.reason).toContain('Frequency cap reached');
  });
});
