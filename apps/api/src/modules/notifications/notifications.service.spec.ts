import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      const mockPrisma = (service as any).prisma;
      mockPrisma.notification = {
        count: jest.fn().mockResolvedValue(5),
      };

      const result = await service.getUnreadCount('user-1');

      expect(result.unreadCount).toEqual(5);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
    });
  });

  describe('Notification Preferences', () => {
    it('should return default notification preferences for user', async () => {
      const prefs = await service.getPreferences('user-pref-1');
      expect(prefs.emailAlerts).toBe(true);
      expect(prefs.pushAlerts).toBe(true);
      expect(prefs.smsAlerts).toBe(false);
    });

    it('should update user notification preferences', async () => {
      const updated = await service.updatePreferences('user-pref-1', {
        smsAlerts: true,
        marketingEmails: false,
      });

      expect(updated.smsAlerts).toBe(true);
      expect(updated.marketingEmails).toBe(false);
      expect(updated.emailAlerts).toBe(true);
    });
  });
});
