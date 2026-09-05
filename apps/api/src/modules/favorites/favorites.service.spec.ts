import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockPrismaService = {
    service: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggleFavorite', () => {
    it('should add service to favorites and return isFavorite true', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 's1', title: 'Plumbing' });

      const res = await service.toggleFavorite('u1', 's1');
      expect(res).toEqual({ isFavorite: true });
    });

    it('should remove service from favorites when toggled twice', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue({ id: 's1', title: 'Plumbing' });

      await service.toggleFavorite('u1', 's1');
      const res = await service.toggleFavorite('u1', 's1');
      expect(res).toEqual({ isFavorite: false });
    });

    it('should throw NotFoundException if service does not exist', async () => {
      mockPrismaService.service.findUnique.mockResolvedValue(null);

      await expect(service.toggleFavorite('u1', 'invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
