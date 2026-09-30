import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './services/campaign.service';
import { CampaignTargetingService } from './services/campaign-targeting.service';
import { PromotionService } from './services/promotion.service';
import { CampaignAnalyticsService } from './services/campaign-analytics.service';

describe('CampaignsModule Services', () => {
  let campaignService: CampaignService;
  let promotionService: PromotionService;
  let analyticsService: CampaignAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignService, CampaignTargetingService, PromotionService, CampaignAnalyticsService],
    }).compile();

    campaignService = module.get<CampaignService>(CampaignService);
    promotionService = module.get<PromotionService>(PromotionService);
    analyticsService = module.get<CampaignAnalyticsService>(CampaignAnalyticsService);
  });

  it('should create campaign and apply percentage discount', async () => {
    const campaign = await campaignService.createCampaign({
      title: 'Fall 20% Off',
      code: 'FALL20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 50,
      totalBudget: 1000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    const res = await promotionService.applyPromotion({
      code: 'FALL20',
      userId: 'user_cmp_1',
      orderAmount: 100,
    });

    expect(res.discountAmount).toBe(20);
    expect(res.finalAmount).toBe(80);
  });

  it('should block duplicate redemption by same user', async () => {
    await campaignService.createCampaign({
      title: 'Fixed $15 Off',
      code: 'SAVE15',
      discountType: 'FIXED',
      discountValue: 15,
      totalBudget: 500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    await promotionService.applyPromotion({ code: 'SAVE15', userId: 'user_cmp_2', orderAmount: 50 });

    await expect(
      promotionService.applyPromotion({ code: 'SAVE15', userId: 'user_cmp_2', orderAmount: 50 })
    ).rejects.toThrow('already redeemed');
  });
});
