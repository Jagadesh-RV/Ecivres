import client from './client';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await client.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await client.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await client.patch('/notifications/read-all');
    return response.data;
  },
};
