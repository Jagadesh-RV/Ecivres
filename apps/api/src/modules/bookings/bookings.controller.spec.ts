import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1' }),
            findAllForCustomer: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a booking', async () => {
    await controller.create(
      { id: 'user1' },
      { serviceId: '1', scheduledAt: '2026-10-10T10:00:00Z' },
    );
    expect(service.create).toHaveBeenCalled();
  });

  it('should list bookings', async () => {
    await controller.findAll({ id: 'user1' });
    expect(service.findAllForCustomer).toHaveBeenCalled();
  });

  it('should reschedule a booking', async () => {
    (service as any).rescheduleBooking = jest.fn().mockResolvedValue({ id: 'b-100', scheduledAt: '2026-12-01T10:00:00Z' });
    const result = await controller.reschedule({ id: 'user1' }, 'b-100', { scheduledAt: '2026-12-01T10:00:00Z' });
    expect(result.id).toEqual('b-100');
    expect(service.rescheduleBooking).toHaveBeenCalledWith('b-100', 'user1', '2026-12-01T10:00:00Z');
  });

  it('should return itemized invoice breakdown', async () => {
    const res = await controller.getInvoice('b-100');
    expect(res.bookingId).toBe('b-100');
    expect(res.totalAmount).toBeGreaterThan(0);
  });
});
