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

  // Broadcasters for Service modules to emit events
  emitBookingUpdate(bookingId: string, booking: any) {
    this.server.to(`booking_${bookingId}`).emit('bookingUpdated', booking);
    if (booking?.customerId) {
      this.server.to(`user_${booking.customerId}`).emit('bookingUpdated', booking);
    }
    if (booking?.service?.provider?.userId) {
      this.server.to(`user_${booking.service.provider.userId}`).emit('bookingUpdated', booking);
    }
  }

  emitNotification(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notificationReceived', notification);
  }

  emitProviderAvailability(providerId: string, isAvailable: boolean) {
    this.server.emit('providerStatusChanged', { providerId, isAvailable });
  }
}
