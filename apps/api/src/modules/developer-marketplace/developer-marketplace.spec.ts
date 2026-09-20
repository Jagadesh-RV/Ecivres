import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { WebhookDispatcherService } from './services/webhook-dispatcher.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('WebhookDispatcherService', () => {
  let service: WebhookDispatcherService;

  const mockPrisma = {
    developerWebhook: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookDispatcherService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WebhookDispatcherService>(WebhookDispatcherService);
  });

  it('should register webhook subscription', async () => {
    mockPrisma.developerWebhook.create.mockResolvedValue({
      webhookId: 'whk_1',
      appId: 'app_1',
      targetUrl: 'https://example.com/webhook',
      isActive: true,
    });

    const res = await service.registerWebhook('app_1', 'https://example.com/webhook', '[]');
    expect(res.webhookId).toBe('whk_1');
    expect(res.isActive).toBe(true);
  });
});
