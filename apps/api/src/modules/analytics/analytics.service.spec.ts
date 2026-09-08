import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            providerProfile: { findUnique: jest.fn() },
            customerProfile: { findUnique: jest.fn() },
            booking: { count: jest.fn(), findMany: jest.fn() },
            review: { findMany: jest.fn() },
            favorite: { count: jest.fn() },
            service: { count: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate provider performance metrics', async () => {
    jest.spyOn(prisma.providerProfile, 'findUnique').mockResolvedValue({ id: 'p-1' } as any);
    jest.spyOn(prisma.booking, 'count').mockResolvedValueOnce(10).mockResolvedValueOnce(8).mockResolvedValueOnce(2);
    jest.spyOn(prisma.review, 'findMany').mockResolvedValue([{ rating: 5 }, { rating: 4 }] as any);

    const metrics = await service.getProviderPerformanceMetrics('user-p1');

    expect(metrics.totalBookings).toEqual(10);
    expect(metrics.completionRate).toEqual(80);
    expect(metrics.averageRating).toEqual(4.5);
  });
});
