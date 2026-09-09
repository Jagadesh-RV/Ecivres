import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

export interface SendMessageDto {
  bookingId?: string;
  recipientId: string;
  content: string;
}

@Injectable()
export class ChatService {
  private messagesStore: any[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      bookingId: dto.bookingId,
      senderId,
      recipientId: dto.recipientId,
      content: dto.content,
      isRead: false,
      createdAt: new Date(),
    };

    this.messagesStore.push(message);
    this.eventsGateway.emitChatMessage(message);
    return message;
  }

  async getConversationHistory(userId: string, otherUserId: string, limit = 50) {
    return this.messagesStore
      .filter(
        (m) =>
          (m.senderId === userId && m.recipientId === otherUserId) ||
          (m.senderId === otherUserId && m.recipientId === userId),
      )
      .slice(-limit);
  }
}
