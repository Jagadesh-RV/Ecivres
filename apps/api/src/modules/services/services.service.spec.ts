import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

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
              findUnique: jest.fn().mockResolvedValue({ id: '1', providerId: 'prov1' }),
              create: jest.fn().mockResolvedValue({ id: '1' }),
              update: jest.fn().mockResolvedValue({ id: '1' }),
              delete: jest.fn().mockResolvedValue({ id: '1' }),
            },
            providerProfile: {
              findUnique: jest.fn().mockResolvedValue({ id: 'prov1', userId: 'user1' }),
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
    await expect(service.create('user2', { name: 'test', price: 10, duration: 60, categoryId: '1' })).rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user tries to update another providers service', async () => {
    jest.spyOn(prisma.providerProfile, 'findUnique').mockResolvedValue({ id: 'prov2', userId: 'user2' } as any);
    await expect(service.update('user2', '1', { name: 'test2' })).rejects.toThrow(ForbiddenException);
  });
});
