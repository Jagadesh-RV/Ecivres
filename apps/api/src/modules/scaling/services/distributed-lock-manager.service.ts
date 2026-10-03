import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DistributedLockManagerService {
  private readonly logger = new Logger(DistributedLockManagerService.name);
  private readonly locksMap = new Map<string, Date>(); // lockKey -> expiry

  async acquireLock(resourceKey: string, ttlMs = 5000): Promise<boolean> {
    const now = new Date();
    const existingExpiry = this.locksMap.get(resourceKey);

    if (existingExpiry && existingExpiry > now) {
      this.logger.warn(`Lock acquisition failed for ${resourceKey} — currently locked`);
      return false;
    }

    const newExpiry = new Date(now.getTime() + ttlMs);
    this.locksMap.set(resourceKey, newExpiry);
    this.logger.log(`Acquired lock for resource '${resourceKey}' (TTL: ${ttlMs}ms)`);
    return true;
  }

  async releaseLock(resourceKey: string): Promise<boolean> {
    const deleted = this.locksMap.delete(resourceKey);
    if (deleted) {
      this.logger.log(`Released lock for resource '${resourceKey}'`);
    }
    return deleted;
  }
}
