import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      providerProfile: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateProviderScore', () => {
    it('should compute weighted provider score correctly', () => {
      const result = service.calculateProviderScore(4.8, 20, 22, 10, 5.0, 0.5);

      expect(result.finalScore).toBeGreaterThan(0.8);
      expect(result.breakdown).toEqual({
        ratingScore: 0.96,
        completionScore: 0.91,
        responseTimeScore: 1,
        distanceScore: 0.9,
        repeatCustomerScore: 0.5,
      });
    });

    it('should penalize long distance and poor response times', () => {
      const result = service.calculateProviderScore(3.0, 5, 10, 300, 45.0, 0.1);

      expect(result.finalScore).toBeLessThan(0.6);
      expect(result.breakdown.distanceScore).toBe(0.1);
      expect(result.breakdown.responseTimeScore).toBe(0.4);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate Haversine distance accurately', () => {
      // Distance between NYC (40.7128, -74.0060) and Philadelphia (39.9526, -75.1652) ~ 129 km
      const dist = service.calculateDistance(40.7128, -74.006, 39.9526, -75.1652);
      expect(dist).toBeGreaterThan(120);
      expect(dist).toBeLessThan(140);
    });
  });

  describe('getRecommendedProviders', () => {
    it('should fetch and rank providers by AI score', async () => {
      (prismaService.providerProfile.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'provider-1',
          businessName: 'Ace Plumbing',
          isVerified: true,
          address: '37.7749, -122.4194',
          services: [{ id: 'srv-1', categoryId: 'cat-1' }],
          user: {
            reviews: [{ rating: 5 }, { rating: 5 }],
            bookings: [{ status: 'COMPLETED', customerId: 'cust-1' }],
          },
        },
      ]);

      const recommendations = await service.getRecommendedProviders({
        latitude: 37.7749,
        longitude: -122.4194,
        limit: 5,
      });

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].businessName).toBe('Ace Plumbing');
      expect(recommendations[0].score).toBeGreaterThan(0.7);
    });
  });
});
