import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ChatMessageMetadata {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'VOICE_NOTE' | 'IMAGE' | 'DOCUMENT' | 'LOCATION';
  mediaUrl?: string;
  durationSeconds?: number;
  reactions: { userId: string; emoji: string }[];
  isPinned: boolean;
  readAt?: Date;
  deliveredAt: Date;
}

export interface LiveLocationUpdate {
  bookingId: string;
  providerId: string;
  latitude: number;
  longitude: number;
  etaMinutes: number;
  updatedAt: Date;
}

@Injectable()
export class CommunicationService {
  private reactionsStore: Map<string, { userId: string; emoji: string }[]> = new Map();
  private pinnedStore: Map<string, Set<string>> = new Map(); // chatId -> Set of messageIds
  private archivedChats: Map<string, Set<string>> = new Map(); // userId -> Set of chatIds
  private liveLocationStore: Map<string, LiveLocationUpdate> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async toggleReaction(messageId: string, userId: string, emoji: string): Promise<{ userId: string; emoji: string }[]> {
    const list = this.reactionsStore.get(messageId) || [];
    const existingIndex = list.findIndex((r) => r.userId === userId && r.emoji === emoji);

    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
    } else {
      list.push({ userId, emoji });
    }

    this.reactionsStore.set(messageId, list);
    return list;
  }

  async togglePinMessage(chatId: string, messageId: string): Promise<boolean> {
    const pins = this.pinnedStore.get(chatId) || new Set();
    let isPinned = false;
    if (pins.has(messageId)) {
      pins.delete(messageId);
    } else {
      pins.add(messageId);
      isPinned = true;
    }
    this.pinnedStore.set(chatId, pins);
    return isPinned;
  }

  async toggleArchiveChat(userId: string, chatId: string): Promise<boolean> {
    const archives = this.archivedChats.get(userId) || new Set();
    let isArchived = false;
    if (archives.has(chatId)) {
      archives.delete(chatId);
    } else {
      archives.add(chatId);
      isArchived = true;
    }
    this.archivedChats.set(userId, archives);
    return isArchived;
  }

  async updateLiveLocation(bookingId: string, providerId: string, latitude: number, longitude: number, etaMinutes: number): Promise<LiveLocationUpdate> {
    const update: LiveLocationUpdate = {
      bookingId,
      providerId,
      latitude,
      longitude,
      etaMinutes,
      updatedAt: new Date(),
    };
    this.liveLocationStore.set(bookingId, update);
    return update;
  }

  async getLiveLocation(bookingId: string): Promise<LiveLocationUpdate | null> {
    return this.liveLocationStore.get(bookingId) || null;
  }
}
