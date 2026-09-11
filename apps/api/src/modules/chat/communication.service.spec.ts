import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from './communication.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
  });

  it('should toggle reactions on messages', async () => {
    let reactions = await service.toggleReaction('msg_1', 'user_1', '👍');
    expect(reactions.length).toBe(1);
    expect(reactions[0].emoji).toBe('👍');

    // Toggle off
    reactions = await service.toggleReaction('msg_1', 'user_1', '👍');
    expect(reactions.length).toBe(0);
  });

  it('should toggle pinned messages and archived chats', async () => {
    const isPinned = await service.togglePinMessage('chat_100', 'msg_1');
    expect(isPinned).toBe(true);

    const isArchived = await service.toggleArchiveChat('user_1', 'chat_100');
    expect(isArchived).toBe(true);
  });

  it('should store and retrieve live location updates & ETA', async () => {
    const loc = await service.updateLiveLocation('book_1', 'prov_1', 37.7749, -122.4194, 15);
    expect(loc.etaMinutes).toBe(15);

    const fetched = await service.getLiveLocation('book_1');
    expect(fetched?.latitude).toBe(37.7749);
  });
});
