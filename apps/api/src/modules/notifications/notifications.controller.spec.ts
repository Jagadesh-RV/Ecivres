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
});
