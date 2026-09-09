import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.server.emit('presenceUpdated', { userId, status: 'OFFLINE' });
        break;
      }
    }
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data?.userId) {
      client.join(`user_${data.userId}`);
      this.connectedUsers.set(data.userId, client.id);
      this.logger.log(`User ${data.userId} joined user_${data.userId} room`);
      this.server.emit('presenceUpdated', { userId: data.userId, status: 'ONLINE' });
      return { status: 'joined', userId: data.userId };
    }
  }

  @SubscribeMessage('joinBookingRoom')
  handleJoinBookingRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string },
  ) {
    if (data?.bookingId) {
      client.join(`booking_${data.bookingId}`);
      this.logger.log(`Client ${client.id} joined booking_${data.bookingId} room`);
      return { status: 'joined', bookingId: data.bookingId };
    }
  }

  @SubscribeMessage('updateProviderStatus')
  handleUpdateProviderStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { providerId: string; isAvailable: boolean },
  ) {
    this.logger.log(`Provider ${data.providerId} status changed to ${data.isAvailable}`);
    this.server.emit('providerStatusChanged', data);
    return { status: 'broadcasted', providerId: data.providerId };
  }

  @SubscribeMessage('updateProviderLocation')
  handleUpdateProviderLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string; providerId: string; latitude: number; longitude: number; speed?: number; heading?: number },
  ) {
    if (data?.bookingId) {
      this.server.to(`booking_${data.bookingId}`).emit('providerLocationStream', data);
      return { status: 'streamed', bookingId: data.bookingId };
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { senderId: string; recipientId: string; bookingId?: string; content: string },
  ) {
    if (data?.recipientId) {
      this.server.to(`user_${data.recipientId}`).emit('chat.message', data);
    }
    if (data?.bookingId) {
      this.server.to(`booking_${data.bookingId}`).emit('chat.message', data);
    }
    return { status: 'sent', recipientId: data.recipientId };
  }

  emitChatMessage(message: { senderId: string; recipientId: string; bookingId?: string; content: string }) {
    if (!this.server) return;
    if (message.recipientId) {
      this.server.to(`user_${message.recipientId}`).emit('chat.message', message);
    }
    if (message.bookingId) {
      this.server.to(`booking_${message.bookingId}`).emit('chat.message', message);
    }
  }

  emitProviderLocationStream(locationData: { bookingId: string; providerId: string; latitude: number; longitude: number }) {
    if (!this.server || !locationData?.bookingId) return;
    this.server.to(`booking_${locationData.bookingId}`).emit('providerLocationStream', locationData);
  }

  // Broadcasters for Service modules to emit events
  emitBookingCreated(booking: any) {
    if (!this.server || !booking?.id) return;
    this.server.to(`booking_${booking.id}`).emit('booking.created', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('booking.created', booking);
    }
    if (booking?.service?.provider?.userId) {
      this.server.to(`user_${booking.service.provider.userId}`).emit('booking.created', booking);
    }
  }

  emitBookingAccepted(booking: any) {
    if (!this.server || !booking?.id) return;
    this.server.to(`booking_${booking.id}`).emit('booking.accepted', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('booking.accepted', booking);
    }
  }

  emitBookingRejected(booking: any) {
    if (!this.server || !booking?.id) return;
    this.server.to(`booking_${booking.id}`).emit('booking.rejected', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('booking.rejected', booking);
    }
  }

  emitBookingStarted(booking: any) {
    if (!this.server || !booking?.id) return;
    this.server.to(`booking_${booking.id}`).emit('booking.started', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('booking.started', booking);
    }
  }

  emitBookingCompleted(booking: any) {
    if (!this.server || !booking?.id) return;
    this.server.to(`booking_${booking.id}`).emit('booking.completed', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('booking.completed', booking);
    }
  }

  emitNotificationCreated(userId: string, notification: any) {
    if (!this.server || !userId) return;
    this.server.to(`user_${userId}`).emit('notification.created', notification);
  }

  emitProviderOnline(providerId: string) {
    if (!this.server || !providerId) return;
    this.server.emit('provider.online', { providerId, timestamp: new Date().toISOString() });
  }

  emitProviderOffline(providerId: string) {
    if (!this.server || !providerId) return;
    this.server.emit('provider.offline', { providerId, timestamp: new Date().toISOString() });
  }

  emitBookingUpdate(bookingId: string, booking: any) {
    if (!this.server || !bookingId) return;
    this.server.to(`booking_${bookingId}`).emit('bookingUpdated', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('bookingUpdated', booking);
    }
    if (booking?.service?.provider?.userId) {
      this.server.to(`user_${booking.service.provider.userId}`).emit('bookingUpdated', booking);
    }
  }

  emitNotification(userId: string, notification: any) {
    if (!this.server || !userId) return;
    this.server.to(`user_${userId}`).emit('notificationReceived', notification);
  }

  emitProviderAvailability(providerId: string, isAvailable: boolean) {
    if (!this.server || !providerId) return;
    this.server.emit('providerStatusChanged', { providerId, isAvailable });
  }
}
