import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SavedCollection {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  providerIds: string[];
  serviceIds: string[];
  createdAt: Date;
}

@Injectable()
export class WishlistService {
  private collectionsStore: SavedCollection[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async createCollection(userId: string, name: string, isPublic = false) {
    const collection: SavedCollection = {
      id: `col_${Date.now()}`,
      userId,
      name,
      isPublic,
      providerIds: [],
      serviceIds: [],
      createdAt: new Date(),
    };
    this.collectionsStore.push(collection);
    return collection;
  }

  async getUserCollections(userId: string) {
    return this.collectionsStore.filter((c) => c.userId === userId);
  }

  async addItemToCollection(userId: string, collectionId: string, item: { providerId?: string; serviceId?: string }) {
    const col = this.collectionsStore.find((c) => c.id === collectionId && c.userId === userId);
    if (!col) {
      throw new NotFoundException('Collection not found');
    }

    if (item.providerId && !col.providerIds.includes(item.providerId)) {
      col.providerIds.push(item.providerId);
    }
    if (item.serviceId && !col.serviceIds.includes(item.serviceId)) {
      col.serviceIds.push(item.serviceId);
    }

    return col;
  }
}
