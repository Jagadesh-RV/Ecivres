import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest
                .fn()
                .mockResolvedValue({
                  id: '1',
                  providerId: 'prov1',
                  provider: { id: 'prov1', userId: 'user1' },
                }),
              create: jest.fn().mockResolvedValue({ id: '1' }),
              update: jest.fn().mockResolvedValue({ id: '1' }),
              delete: jest.fn().mockResolvedValue({ id: '1' }),
            },
            providerProfile: {
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 'prov1', userId: 'user1' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany on findAll', async () => {
    await service.findAll();
    expect(prisma.service.findMany).toHaveBeenCalled();
  });

  it('should throw BadRequestException if user is not a provider when creating', async () => {
    jest.spyOn(prisma.providerProfile, 'findUnique').mockResolvedValue(null);
    await expect(
      service.create('user2', {
        name: 'test',
        price: 10,
        duration: 60,
        categoryId: '1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user tries to update another providers service', async () => {
    jest
      .spyOn(prisma.providerProfile, 'findUnique')
      .mockResolvedValue({ id: 'prov2', userId: 'user2' } as any);
    await expect(
      service.update('1', 'user2', { name: 'test2' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should update service successfully when owned by provider', async () => {
    const result = await service.update('1', 'user1', { name: 'Updated Name', price: 99 });
    expect(result).toBeDefined();
    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'Updated Name', price: 99 },
    });
  });

  it('should delete service successfully when owned by provider', async () => {
    const result = await service.remove('1', 'user1');
    expect(result).toBeDefined();
    expect(prisma.service.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should support price_asc sorting in findAll', async () => {
    await service.findAll({ sortBy: 'price_asc' as any });
    expect(prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { price: 'asc' } }),
    );
  });
});
