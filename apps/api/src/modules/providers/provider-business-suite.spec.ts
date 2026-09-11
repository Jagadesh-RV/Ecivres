import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAnalyticsService } from './provider-analytics.service';
import { ProviderStaffService } from './provider-staff.service';
import { ProviderInventoryService } from './provider-inventory.service';
import { ProviderPortfolioService } from './provider-portfolio.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('Provider Business Suite Services', () => {
  let analyticsService: ProviderAnalyticsService;
  let staffService: ProviderStaffService;
  let inventoryService: ProviderInventoryService;
  let portfolioService: ProviderPortfolioService;

  const mockPrismaService = {
    booking: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'b1', totalAmount: 150, status: 'COMPLETED', createdAt: new Date() },
        { id: 'b2', totalAmount: 200, status: 'COMPLETED', createdAt: new Date() },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderAnalyticsService,
        ProviderStaffService,
        ProviderInventoryService,
        ProviderPortfolioService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    analyticsService = module.get<ProviderAnalyticsService>(ProviderAnalyticsService);
    staffService = module.get<ProviderStaffService>(ProviderStaffService);
    inventoryService = module.get<ProviderInventoryService>(ProviderInventoryService);
    portfolioService = module.get<ProviderPortfolioService>(ProviderPortfolioService);
  });

  describe('ProviderAnalyticsService', () => {
    it('should compute business analytics correctly', async () => {
      const result = await analyticsService.getBusinessAnalytics('prov_123');
      expect(result.providerId).toBe('prov_123');
      expect(result.dailyEarnings).toBeGreaterThanOrEqual(0);
      expect(result.revenueForecastNextMonth).toBeGreaterThan(0);
      expect(result.aiInsights.length).toBeGreaterThan(0);
    });
  });

  describe('ProviderStaffService', () => {
    it('should add and retrieve staff members', async () => {
      const staff = await staffService.addStaffMember('prov_123', {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'MANAGER',
        permissions: ['MANAGE_STAFF'],
      });

      expect(staff.fullName).toBe('Jane Doe');
      expect(staff.role).toBe('MANAGER');

      const list = await staffService.getStaffMembers('prov_123');
      expect(list.length).toBe(1);
    });
  });

  describe('ProviderInventoryService', () => {
    it('should track inventory and calculate tax estimates', async () => {
      await inventoryService.addInventoryItem('prov_123', {
        name: 'HVAC Filter Pack',
        category: 'SUPPLIES',
        quantity: 20,
        minThreshold: 5,
        unitCost: 15,
      });

      await inventoryService.logExpense('prov_123', {
        title: 'Tools purchase',
        amount: 100,
        category: 'EQUIPMENT',
      });

      const taxReport = await inventoryService.calculateTaxEstimate('prov_123', 0.2);
      expect(taxReport.grossRevenue).toBe(350);
      expect(taxReport.totalExpenses).toBe(100);
      expect(taxReport.taxableIncome).toBe(250);
      expect(taxReport.estimatedTax).toBe(50);
    });
  });

  describe('ProviderPortfolioService', () => {
    it('should add portfolio items and certificates', async () => {
      const item = await portfolioService.addPortfolioItem('prov_123', {
        title: 'Bathroom Remodel',
        category: 'Plumbing',
        beforeImageUrl: 'http://img1.jpg',
        afterImageUrl: 'http://img2.jpg',
      });
      expect(item.title).toBe('Bathroom Remodel');

      const cert = await portfolioService.addCertificate('prov_123', {
        title: 'Master Electrician License',
        issuingOrganization: 'State Board',
        issueDate: new Date(),
      });
      expect(cert.verified).toBe(true);
    });
  });
});
