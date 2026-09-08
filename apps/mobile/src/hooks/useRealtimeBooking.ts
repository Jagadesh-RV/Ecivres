import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_SOCKET_URL = 'http://10.0.2.2:5001'; // Default Android emulator host loopback to NestJS API

export interface MobileBookingStatus {
  id: string;
  status: string;
  scheduledAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export function useRealtimeBooking(bookingId: string | null, userId?: string) {
  const [bookingStatus, setBookingStatus] = useState<MobileBookingStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const socket: Socket = io(`${API_SOCKET_URL}/realtime`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinBookingRoom', { bookingId });
      if (userId) {
        socket.emit('joinUserRoom', { userId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('bookingUpdated', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    socket.on('booking.created', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    socket.on('booking.accepted', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    socket.on('booking.started', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    socket.on('booking.completed', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    socket.on('booking.rejected', (updated: MobileBookingStatus) => {
      if (updated.id === bookingId) setBookingStatus(updated);
    });

    return () => {
      socket.disconnect();
    };
  }, [bookingId, userId]);

  return { bookingStatus, isConnected };
}
