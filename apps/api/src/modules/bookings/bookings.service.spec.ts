import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              create: jest.fn().mockResolvedValue({ id: '1' }),
              findMany: jest.fn().mockResolvedValue([]),
            },
            customerProfile: {
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 'cust1', user: { id: 'user1' } }),
            },
            service: {
              findUnique: jest.fn().mockResolvedValue({ id: 'srv1' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if no customer profile', async () => {
    jest.spyOn(prisma.customerProfile, 'findUnique').mockResolvedValue(null);
    await expect(
      service.create('user1', {
        serviceId: 'srv1',
        scheduledAt: '2026-10-10T10:00:00Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if service not found', async () => {
    jest.spyOn(prisma.service, 'findUnique').mockResolvedValue(null);
    await expect(
      service.create('user1', {
        serviceId: 'srv1',
        scheduledAt: '2026-10-10T10:00:00Z',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create booking', async () => {
    await service.create('user1', {
      serviceId: 'srv1',
      scheduledAt: '2026-10-10T10:00:00Z',
    });
    expect(prisma.booking.create).toHaveBeenCalled();
  });
});
