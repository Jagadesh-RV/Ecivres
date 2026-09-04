import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      customerProfile: { findUnique: jest.fn() },
      booking: { findUnique: jest.fn() },
      review: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByService', () => {
    it('should return list of reviews for a given service', async () => {
      const mockReviews = [{ id: 'r1', rating: 5, comment: 'Great job!' }];
      prismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.findByService('service-1');
      expect(result).toEqual(mockReviews);
      expect(prismaService.review.findMany).toHaveBeenCalled();
    });
  });

  describe('getProviderStats', () => {
    it('should compute average rating and count accurately', async () => {
      prismaService.review.findMany.mockResolvedValue([{ rating: 5 }, { rating: 3 }]);

      const result = await service.getProviderStats('provider-1');
      expect(result).toEqual({ average: 4, count: 2 });
    });

    it('should return zero average when provider has no reviews', async () => {
      prismaService.review.findMany.mockResolvedValue([]);

      const result = await service.getProviderStats('provider-1');
      expect(result).toEqual({ average: 0, count: 0 });
    });
  });

  describe('Review Moderation', () => {
    it('should flag a review for moderation', async () => {
      prismaService.review.findUnique = jest.fn().mockResolvedValue({ id: 'r100' });
      const result = await service.flagReview('r100', 'Spam content');
      expect(result.message).toContain('flagged for admin moderation');
    });

    it('should moderate (approve) a flagged review', async () => {
      prismaService.review.findUnique = jest.fn().mockResolvedValue({ id: 'r101' });
      await service.flagReview('r101', 'Inappropriate content');

      const result = await service.moderateReview('r101', 'APPROVE', 'Verified clean content');
      expect(result.action).toEqual('APPROVE');
      expect(result.status).toEqual('APPROVED');
    });
  });
});
