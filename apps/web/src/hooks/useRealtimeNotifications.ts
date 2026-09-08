'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(`${API_SOCKET_URL}/realtime`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      socket.emit('joinUserRoom', { userId });
    });

    socket.on('notificationReceived', (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    socket.on('notification.created', (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return { notifications, unreadCount, setUnreadCount };
}
