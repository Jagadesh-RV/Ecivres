import { Test, TestingModule } from '@nestjs/testing';
import { AiPricingAssistantService } from './pricing-assistant.service';
import { AiCustomerInsightsService } from './customer-insights.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('Marketplace Intelligence AI Services', () => {
  let pricingService: AiPricingAssistantService;
  let insightsService: AiCustomerInsightsService;

  const mockPrismaService = {
    service: {
      findUnique: jest.fn().mockResolvedValue({ id: 'srv_123', price: 100 }),
    },
    booking: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'b1',
          totalAmount: 150,
          status: 'COMPLETED',
          createdAt: new Date(),
          service: { category: { name: 'Cleaning' } },
        },
        {
          id: 'b2',
          totalAmount: 200,
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          service: { category: { name: 'Plumbing' } },
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiPricingAssistantService,
        AiCustomerInsightsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    pricingService = module.get<AiPricingAssistantService>(AiPricingAssistantService);
    insightsService = module.get<AiCustomerInsightsService>(AiCustomerInsightsService);
  });

  describe('AiPricingAssistantService', () => {
    it('should compute dynamic price with multipliers & competitor range', async () => {
      const result = await pricingService.calculateDynamicPrice('srv_123', 'prov_456', 1.3);
      expect(result.basePrice).toBe(100);
      expect(result.recommendedPrice).toBeGreaterThan(100);
      expect(result.competitorMin).toBeLessThan(100);
      expect(result.competitorMax).toBeGreaterThan(100);
      expect(result.estimatedProfitMargin).toBeGreaterThan(0);
    });

    it('should suggest discount campaigns', async () => {
      const campaign = await pricingService.suggestDiscountCampaign('prov_456');
      expect(campaign.suggestedDiscountPercent).toBe(15);
      expect(campaign.expectedBookingLiftPercent).toBeGreaterThan(0);
    });
  });

  describe('AiCustomerInsightsService', () => {
    it('should compute customer LTV, categories & churn risk', async () => {
      const insights = await insightsService.getCustomerInsights('cust_789');
      expect(insights.lifetimeValue).toBe(350);
      expect(insights.avgOrderValue).toBe(175);
      expect(insights.favoriteCategories.length).toBe(2);
      expect(insights.churnRiskScore).toBeGreaterThanOrEqual(0);
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(insights.churnRiskLevel);
    });
  });
});
