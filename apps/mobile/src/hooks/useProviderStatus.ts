import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_SOCKET_URL = 'http://10.0.2.2:5001';

export function useProviderStatus(providerId: string | null) {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    if (!providerId) return;

    const socket: Socket = io(`${API_SOCKET_URL}/realtime`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('provider.online', (data: { providerId: string }) => {
      if (data.providerId === providerId) {
        setIsOnline(true);
      }
    });

    socket.on('provider.offline', (data: { providerId: string }) => {
      if (data.providerId === providerId) {
        setIsOnline(false);
      }
    });

    socket.on('providerStatusChanged', (data: { providerId: string; isAvailable: boolean }) => {
      if (data.providerId === providerId) {
        setIsOnline(data.isAvailable);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [providerId]);

  return { isOnline };
}
