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

  describe('getProviderDashboardStats', () => {
    it('should calculate provider earnings and booking statistics', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(mockProvider);
      prismaService.service = {
        count: jest.fn().mockResolvedValue(4),
      };
      prismaService.booking = {
        count: jest.fn().mockResolvedValue(10),
        findMany: jest.fn().mockResolvedValue([
          { id: 'b-1', service: { price: 200 } },
          { id: 'b-2', service: { price: 350 } },
        ]),
      };

      const result = await service.getProviderDashboardStats('user-1');

      expect(result.activeServicesCount).toEqual(4);
      expect(result.totalBookingsCount).toEqual(10);
      expect(result.totalEarnings).toEqual(550);
    });

    it('should throw NotFoundException when provider profile does not exist', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(null);

      await expect(service.getProviderDashboardStats('user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAvailability', () => {
    it('should return weekly operating schedule with slot duration', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(mockProvider);

      const result = await service.getAvailability('user-1');

      expect(result).toHaveLength(7);
      expect(result[0].day).toEqual('MONDAY');
      expect(result[0].slotDurationMinutes).toEqual(60);
    });
  });

  describe('updateAvailability', () => {
    it('should update operating availability schedule', async () => {
      prismaService.providerProfile.findUnique.mockResolvedValue(mockProvider);

      const schedule = [{ day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '18:00' }];
      const result = await service.updateAvailability('user-1', schedule);

      expect(result.message).toContain('updated successfully');
      expect(result.schedule).toEqual(schedule);
    });
  });
});
