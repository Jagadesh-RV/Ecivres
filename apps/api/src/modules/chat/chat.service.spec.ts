import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

describe('ChatService', () => {
  let service: ChatService;
  let eventsGateway: jest.Mocked<EventsGateway>;

  beforeEach(async () => {
    const mockPrisma = {};
    const mockEventsGateway = {
      emitChatMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    eventsGateway = module.get(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send and broadcast realtime chat message', async () => {
    const msg = await service.sendMessage('user-1', {
      recipientId: 'user-2',
      content: 'Hello, what time will you arrive?',
    });

    expect(msg.content).toBe('Hello, what time will you arrive?');
    expect(eventsGateway.emitChatMessage).toHaveBeenCalledWith(msg);
  });

  it('should retrieve conversation history between two users', async () => {
    await service.sendMessage('user-1', { recipientId: 'user-2', content: 'Message 1' });
    await service.sendMessage('user-2', { recipientId: 'user-1', content: 'Message 2' });

    const history = await service.getConversationHistory('user-1', 'user-2');
    expect(history.length).toBeGreaterThanOrEqual(2);
  });
});
