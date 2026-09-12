import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperPlatformService } from './developer-platform.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DeveloperPlatformService', () => {
  let service: DeveloperPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeveloperPlatformService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<DeveloperPlatformService>(DeveloperPlatformService);
  });

  it('should generate API key with custom scopes and rate limits', async () => {
    const key = await service.createApiKey('dev_100', 'Production App', ['READ_SERVICES']);
    expect(key.apiKey).toContain('ecv_live_');
    expect(key.scopes).toContain('READ_SERVICES');
    expect(key.rateLimitPerMinute).toBe(600);
  });

  it('should register webhook subscriptions and sign secrets', async () => {
    const sub = await service.registerWebhook('dev_100', 'https://example.com/webhooks', ['booking.created']);
    expect(sub.targetUrl).toBe('https://example.com/webhooks');
    expect(sub.secret).toContain('whsec_');
  });
});
