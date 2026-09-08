'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface RealtimeBookingStatus {
  id: string;
  status: string;
  scheduledAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export function useRealtimeBooking(bookingId: string | null, userId?: string) {
  const [booking, setBooking] = useState<RealtimeBookingStatus | null>(null);
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

    socket.on('bookingUpdated', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) {
        setBooking(updated);
      }
    });

    socket.on('booking.created', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) setBooking(updated);
    });

    socket.on('booking.accepted', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) setBooking(updated);
    });

    socket.on('booking.started', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) setBooking(updated);
    });

    socket.on('booking.completed', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) setBooking(updated);
    });

    socket.on('booking.rejected', (updated: RealtimeBookingStatus) => {
      if (updated.id === bookingId) setBooking(updated);
    });

    return () => {
      socket.disconnect();
    };
  }, [bookingId, userId]);

  return { booking, isConnected };
}
