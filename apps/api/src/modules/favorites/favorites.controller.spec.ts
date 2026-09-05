import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;

  const mockFavoritesService = {
    getUserFavorites: jest.fn(),
    toggleFavorite: jest.fn(),
    checkIsFavorite: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [{ provide: FavoritesService, useValue: mockFavoritesService }],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user favorites', async () => {
    mockFavoritesService.getUserFavorites.mockResolvedValue([{ id: 's1' }]);
    const req = { user: { id: 'u1' } };
    const res = await controller.getUserFavorites(req);
    expect(res).toEqual([{ id: 's1' }]);
  });

  it('should toggle favorite status', async () => {
    mockFavoritesService.toggleFavorite.mockResolvedValue({ isFavorite: true });
    const req = { user: { id: 'u1' } };
    const res = await controller.toggleFavorite(req, { serviceId: 's1' });
    expect(res).toEqual({ isFavorite: true });
  });
});
