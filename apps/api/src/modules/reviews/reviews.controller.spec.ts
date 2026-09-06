import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1' }),
            findAllForService: jest.fn().mockResolvedValue([]),
            getProviderStats: jest.fn().mockResolvedValue({ averageRating: 0, totalReviews: 0 }),
            checkReviewEligibility: jest.fn().mockResolvedValue({ eligible: true }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call checkReviewEligibility on checkEligibility endpoint', async () => {
    const res = await controller.checkEligibility({ user: { id: 'u1' } }, 'b100');
    expect(res.eligible).toBe(true);
  });
});

