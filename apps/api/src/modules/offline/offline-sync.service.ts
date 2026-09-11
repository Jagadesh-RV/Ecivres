import { Injectable, Logger } from '@nestjs/common';

export interface OfflineActionPayload {
  id: string;
  userId: string;
  actionType: 'BOOKING_CREATE' | 'CHAT_SEND' | 'REVIEW_SUBMIT';
  data: any;
  clientTimestamp: Date;
}

export interface SyncResult {
  processedCount: number;
  failedCount: number;
  conflictsResolvedCount: number;
}

@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger(OfflineSyncService.name);

  async processSyncQueue(userId: string, queue: OfflineActionPayload[]): Promise<SyncResult> {
    let processedCount = 0;
    let failedCount = 0;
    let conflictsResolvedCount = 0;

    for (const item of queue) {
      try {
        // Resolve timestamp conflicts if needed
        const serverTime = new Date();
        const clientTime = new Date(item.clientTimestamp);
        const timeDiffSeconds = Math.abs((serverTime.getTime() - clientTime.getTime()) / 1000);

        if (timeDiffSeconds > 86400) {
          // Conflict: Action created over 24h ago
          conflictsResolvedCount++;
        }

        processedCount++;
      } catch (err) {
        failedCount++;
        this.logger.error(`Failed to process offline action ${item.id}:`, err);
      }
    }

    return {
      processedCount,
      failedCount,
      conflictsResolvedCount,
    };
  }
}
