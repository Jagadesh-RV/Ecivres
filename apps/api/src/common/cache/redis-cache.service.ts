import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private cacheStore = new Map<string, { data: any; expiresAt: number }>();

  constructor(private configService: ConfigService) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cacheStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cacheStore.delete(key);
      return null;
    }
    return entry.data as T;
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    this.cacheStore.set(key, {
      data: value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.cacheStore.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    for (const key of this.cacheStore.keys()) {
      if (key.includes(pattern)) {
        this.cacheStore.delete(key);
      }
    }
  }
}
