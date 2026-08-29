import { client } from "../axios";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await client.get("/notifications");
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await client.patch(`/notifications/${id}/read`);
    return response.data;
  },
};
