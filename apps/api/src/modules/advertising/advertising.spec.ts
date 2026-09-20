import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AdBiddingService } from './services/ad-bidding.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdBiddingService', () => {
  let service: AdBiddingService;

  const mockPrisma = {
    adCampaign: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdBiddingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdBiddingService>(AdBiddingService);
  });

  it('should create an ad campaign', async () => {
    mockPrisma.adCampaign.create.mockResolvedValue({
      campaignId: 'camp_123',
      providerId: 'prov_1',
      title: 'Test Ad',
      status: 'ACTIVE',
    });

    const res = await service.createCampaign('prov_1', 'Test Ad', 2.0, 100);
    expect(res.campaignId).toBe('camp_123');
  });
});
