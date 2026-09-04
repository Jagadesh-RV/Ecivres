import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, title: string, body: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        body,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You cannot update this notification');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  private userPreferences: Record<string, any> = {};

  async getPreferences(userId: string) {
    if (!this.userPreferences[userId]) {
      this.userPreferences[userId] = {
        emailAlerts: true,
        pushAlerts: true,
        smsAlerts: false,
        marketingEmails: true,
      };
    }
    return this.userPreferences[userId];
  }

  async updatePreferences(userId: string, dto: any) {
    const current = await this.getPreferences(userId);
    const updated = {
      ...current,
      ...dto,
    };
    this.userPreferences[userId] = updated;
    return updated;
  }
}
