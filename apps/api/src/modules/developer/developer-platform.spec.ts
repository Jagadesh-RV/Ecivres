import { ApiKeyManagerService } from './api-key-manager.service';
import { WebhookEngineService } from './webhook-engine.service';

describe('Developer Platform Services', () => {
  describe('ApiKeyManagerService', () => {
    let keyManager: ApiKeyManagerService;

    beforeEach(() => {
      keyManager = new ApiKeyManagerService();
    });

    it('should generate secure API key with prefix and secret', () => {
      const { rawSecretKey, keyRecord } = keyManager.generateApiKey('Staging Key', ['read:bookings']);
      expect(rawSecretKey).toContain('ecv_live_');
      expect(keyRecord.keyPrefix).toBeDefined();
    });

    it('should verify scope wildcard matching', () => {
      expect(keyManager.verifyScope(['*'], 'write:services')).toBe(true);
      expect(keyManager.verifyScope(['read:bookings'], 'write:services')).toBe(false);
    });
  });

  describe('WebhookEngineService', () => {
    let webhookEngine: WebhookEngineService;

    beforeEach(() => {
      webhookEngine = new WebhookEngineService();
    });

    it('should deliver webhook payload with HTTP 200 response', async () => {
      const res = await webhookEngine.dispatchWebhookEvent(
        { id: 'sub_1', targetUrl: 'https://api.partner.com/webhook', events: ['booking.created'], secret: 'whsec_123', isActive: true },
        { eventId: 'evt_1', eventType: 'booking.created', timestamp: new Date().toISOString(), data: {} }
      );
      expect(res.delivered).toBe(true);
      expect(res.statusCode).toBe(200);
    });
  });
});
