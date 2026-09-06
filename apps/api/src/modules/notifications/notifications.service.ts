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

  async sendMarketplaceEventNotification(
    userId: string,
    eventType: 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'BOOKING_RESCHEDULED' | 'BOOKING_COMPLETED' | 'PAYMENT_COMPLETED' | 'REVIEW_REQUESTED',
    payload: { bookingId?: string; serviceName?: string; extra?: string } = {},
  ) {
    const templates: Record<string, { title: string; body: string }> = {
      BOOKING_CREATED: {
        title: 'Booking Created',
        body: `Your booking for "${payload.serviceName || 'Service'}" has been created successfully.`,
      },
      BOOKING_ACCEPTED: {
        title: 'Booking Accepted',
        body: `Provider confirmed your booking request for "${payload.serviceName || 'Service'}".`,
      },
      BOOKING_REJECTED: {
        title: 'Booking Declined',
        body: `Booking for "${payload.serviceName || 'Service'}" was declined${payload.extra ? ': ' + payload.extra : '.'}`,
      },
      BOOKING_RESCHEDULED: {
        title: 'Booking Rescheduled',
        body: `Your booking for "${payload.serviceName || 'Service'}" was rescheduled to ${payload.extra || 'a new time slot'}.`,
      },
      BOOKING_COMPLETED: {
        title: 'Service Completed',
        body: `Service "${payload.serviceName || 'Service'}" was marked as completed by provider.`,
      },
      PAYMENT_COMPLETED: {
        title: 'Payment Confirmed',
        body: `Payment for booking "${payload.serviceName || 'Service'}" has been settled.`,
      },
      REVIEW_REQUESTED: {
        title: 'Leave a Review',
        body: `Please take a moment to rate and review your completed service "${payload.serviceName || 'Service'}".`,
      },
    };

    const template = templates[eventType] || {
      title: 'Marketplace Notification',
      body: `Notification regarding your service "${payload.serviceName || 'Service'}".`,
    };

    return this.create(userId, template.title, template.body);
  }
}

