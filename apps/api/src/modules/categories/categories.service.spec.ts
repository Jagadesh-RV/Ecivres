import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findMany: jest
                .fn()
                .mockResolvedValue([{ id: '1', name: 'Cleaning' }]),
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany and return array of categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', name: 'Cleaning' }]);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      include: {
        _count: {
          select: { services: true }
        }
      }
    });
  });

  describe('create', () => {
    it('should create and return new category', async () => {
      const dto = { name: 'Plumbing', description: 'Plumbing services', icon: '🚰' };
      (prisma.category as any).create = jest.fn().mockResolvedValue({ id: '2', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: '2', ...dto });
      expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findOne', () => {
    it('should return category when found', async () => {
      (prisma.category as any).findUnique = jest.fn().mockResolvedValue({ id: '1', name: 'Cleaning' });

      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', name: 'Cleaning' });
    });

    it('should throw exception when category is missing', async () => {
      (prisma.category as any).findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });
});
