import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiKeyManagerService } from './api-key-manager.service';
import { WebhookEngineService, WebhookSubscription } from './webhook-engine.service';

@Controller('developer')
export class DeveloperPortalController {
  constructor(
    private readonly apiKeyManager: ApiKeyManagerService,
    private readonly webhookEngine: WebhookEngineService,
  ) {}

  @Post('api-keys')
  createApiKey(@Body() body: { name: string; scopes: string[] }) {
    return this.apiKeyManager.generateApiKey(body.name, body.scopes || ['*']);
  }

  @Post('webhooks/test-dispatch')
  async testWebhookDispatch(@Body() body: { subscription: WebhookSubscription; eventType: string }) {
    return this.webhookEngine.dispatchWebhookEvent(body.subscription, {
      eventId: `evt_${Date.now()}`,
      eventType: body.eventType || 'booking.created',
      timestamp: new Date().toISOString(),
      data: { test: true },
    });
  }
}
