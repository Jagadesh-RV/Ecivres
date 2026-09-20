import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseNetworkService } from './services/franchise-network.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FranchiseNetworkService', () => {
  let service: FranchiseNetworkService;

  const mockPrisma = {
    franchiseNetwork: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FranchiseNetworkService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FranchiseNetworkService>(FranchiseNetworkService);
  });

  it('should calculate royalty split correctly', async () => {
    mockPrisma.franchiseNetwork.findUnique.mockResolvedValue({
      networkId: 'fnet_1',
      royaltyRate: 0.10,
    });

    const res = await service.calculateRoyaltySplit('fnet_1', 1000);
    expect(res.royaltyFee).toBe(100);
    expect(res.netRevenue).toBe(900);
  });
});
