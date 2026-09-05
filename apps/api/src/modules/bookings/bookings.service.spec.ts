import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

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
              findUnique: jest.fn().mockResolvedValue({ id: 'srv1', provider: { userId: 'prov1' } }),
            },
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
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
    (prisma.booking as any).findFirst = jest.fn().mockResolvedValue(null);
    await service.create('user1', {
      serviceId: 'srv1',
      scheduledAt: '2026-10-10T10:00:00Z',
    });
    expect(prisma.booking.create).toHaveBeenCalled();
  });

  it('should throw BadRequestException when time slot has booking conflict', async () => {
    (prisma.booking as any).findFirst = jest.fn().mockResolvedValue({ id: 'existing_b' });
    await expect(
      service.create('user1', {
        serviceId: 'srv1',
        scheduledAt: '2026-10-10T10:00:00Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should accept booking request', async () => {
    jest.spyOn(service, 'updateStatus').mockResolvedValue({ id: 'b1', status: 'CONFIRMED' } as any);
    const result = await service.acceptBooking('b1', 'prov_user');
    expect(result.status).toBe('CONFIRMED');
    expect(service.updateStatus).toHaveBeenCalledWith('b1', 'prov_user', { status: 'CONFIRMED' });
  });

  it('should reject invalid booking status transitions in updateStatus', async () => {
    (prisma as any).providerProfile = {
      findUnique: jest.fn().mockResolvedValue({ id: 'p1' }),
    };
    (prisma.booking as any).findUnique = jest.fn().mockResolvedValue({
      id: 'b1',
      status: 'PENDING',
      service: { providerId: 'p1' },
    });

    await expect(
      service.updateStatus('b1', 'user_p1', { status: 'COMPLETED' as any }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should allow valid booking status transitions in updateStatus', async () => {
    (prisma as any).providerProfile = {
      findUnique: jest.fn().mockResolvedValue({ id: 'p1' }),
    };
    (prisma.booking as any).findUnique = jest.fn().mockResolvedValue({
      id: 'b1',
      status: 'PENDING',
      service: { providerId: 'p1', name: 'Test' },
    });
    (prisma.booking as any).update = jest.fn().mockResolvedValue({
      id: 'b1',
      status: 'CONFIRMED',
      customerId: 'c1',
      service: { name: 'Test' },
    });

    const result = await service.updateStatus('b1', 'user_p1', { status: 'CONFIRMED' as any });
    expect(result.status).toBe('CONFIRMED');
  });
});

