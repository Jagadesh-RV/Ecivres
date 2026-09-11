import { Test, TestingModule } from '@nestjs/testing';
import { OfflineSyncService, OfflineActionPayload } from './offline-sync.service';

describe('OfflineSyncService', () => {
  let service: OfflineSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfflineSyncService],
    }).compile();

    service = module.get<OfflineSyncService>(OfflineSyncService);
  });

  it('should process queued offline actions and count conflicts', async () => {
    const queue: OfflineActionPayload[] = [
      {
        id: 'off_1',
        userId: 'u100',
        actionType: 'BOOKING_CREATE',
        data: { serviceId: 's1' },
        clientTimestamp: new Date(),
      },
      {
        id: 'off_2',
        userId: 'u100',
        actionType: 'CHAT_SEND',
        data: { text: 'Hello' },
        clientTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48h ago
      },
    ];

    const result = await service.processSyncQueue('u100', queue);
    expect(result.processedCount).toBe(2);
    expect(result.conflictsResolvedCount).toBe(1);
    expect(result.failedCount).toBe(0);
  });
});
