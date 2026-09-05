import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private userFavoritesMap = new Map<string, Set<string>>();

  constructor(private prisma: PrismaService) {}

  async toggleFavorite(userId: string, serviceId: string): Promise<{ isFavorite: boolean }> {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException(`Service #${serviceId} not found`);
    }

    let userSet = this.userFavoritesMap.get(userId);
    if (!userSet) {
      userSet = new Set<string>();
      this.userFavoritesMap.set(userId, userSet);
    }

    if (userSet.has(serviceId)) {
      userSet.delete(serviceId);
      return { isFavorite: false };
    } else {
      userSet.add(serviceId);
      return { isFavorite: true };
    }
  }

  async getUserFavorites(userId: string) {
    const userSet = this.userFavoritesMap.get(userId) || new Set<string>();
    const favoriteIds = Array.from(userSet);

    if (favoriteIds.length === 0) {
      return [];
    }

    return this.prisma.service.findMany({
      where: { id: { in: favoriteIds } },
      include: {
        provider: { select: { id: true, businessName: true, isVerified: true } },
        category: { select: { id: true, name: true } },
      },
    });
  }

  async checkIsFavorite(userId: string, serviceId: string): Promise<{ isFavorite: boolean }> {
    const userSet = this.userFavoritesMap.get(userId);
    return { isFavorite: !!userSet && userSet.has(serviceId) };
  }
}
