import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const mockPrisma = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and retrieve user collections', async () => {
    const col = await service.createCollection('user-1', 'Summer Home Services', true);
    expect(col.name).toBe('Summer Home Services');

    const userCols = await service.getUserCollections('user-1');
    expect(userCols.length).toBe(1);
  });

  it('should add provider to collection', async () => {
    const col = await service.createCollection('user-1', 'My Favorite Plumbers');
    const updated = await service.addItemToCollection('user-1', col.id, { providerId: 'prov-101' });

    expect(updated.providerIds).toContain('prov-101');
  });
});
