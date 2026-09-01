import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProvidersService', () => {
  let service: ProvidersService;
  let prismaService: any;

  const mockProvider = {
    id: 'provider-1',
    userId: 'user-1',
    businessName: 'Apex Plumbing Solutions',
    description: 'Expert plumbing services',
    phone: '555-0199',
    address: '123 Main St',
    isVerified: true,
    services: [],
  };

  beforeEach(async () => {
    prismaService = {
      providerProfile: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of provider profiles', async () => {
      prismaService.providerProfile.findMany.mockResolvedValue([mockProvider]);

      const result = await service.findAll({});

      expect(result).toEqual([mockProvider]);
      expect(prismaService.providerProfile.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return provider profile by id', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(mockProvider);

      const result = await service.findOne('provider-1');

      expect(result.id).toEqual('provider-1');
      expect(result.businessName).toEqual('Apex Plumbing Solutions');
    });

    it('should throw NotFoundException when provider is not found', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
