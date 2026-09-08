import { Test, TestingModule } from '@nestjs/testing';
import { PushService } from './push.service';
import { PushConfigService } from './push.config';
import { PushDispatcherService } from './push-dispatcher.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { DevicePlatform } from './dto/register-device.dto';

describe('PushService & PushDispatcherService', () => {
  let pushService: PushService;
  let dispatcherService: PushDispatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushService,
        PushDispatcherService,
        PushConfigService,
        { provide: PrismaService, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-firebase-val'),
          },
        },
      ],
    }).compile();

    pushService = module.get<PushService>(PushService);
    dispatcherService = module.get<PushDispatcherService>(PushDispatcherService);
  });

  it('should register device token and send push notification', async () => {
    const res = await pushService.registerDevice('u-1', {
      token: 'fcm-token-123',
      platform: DevicePlatform.ANDROID,
    });

    expect(res.success).toBe(true);
    expect(res.registeredTokensCount).toEqual(1);

    const pushRes = await dispatcherService.sendBookingAcceptancePush('u-1', 'b-1', 'House Cleaning');
    expect(pushRes.success).toBe(true);
    expect(pushRes.deliveredCount).toEqual(1);
  });
});
