import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            findAllForUser: jest.fn().mockResolvedValue([]),
            markAsRead: jest.fn().mockResolvedValue({ id: '1' }),
            sendMarketplaceEventNotification: jest.fn().mockResolvedValue({ id: 'n1', title: 'Booking Created' }),
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

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call sendMarketplaceEventNotification on triggerEvent endpoint', async () => {
    const res = await controller.triggerEvent(
      { id: 'u1' },
      { eventType: 'BOOKING_CREATED', serviceName: 'Plumbing' },
    );
    expect(res.title).toBe('Booking Created');
  });
});

