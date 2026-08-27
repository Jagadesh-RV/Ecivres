import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
});
