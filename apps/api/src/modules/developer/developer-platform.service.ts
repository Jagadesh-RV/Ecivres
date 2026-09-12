import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ApiKeyRecord {
  id: string;
  developerUserId: string;
  keyName: string;
  apiKey: string;
  scopes: string[];
  rateLimitPerMinute: number;
  active: boolean;
  createdAt: Date;
}

export interface WebhookSubscription {
  id: string;
  developerUserId: string;
  targetUrl: string;
  events: string[];
  secret: string;
  active: boolean;
}

@Injectable()
export class DeveloperPlatformService {
  private apiKeys: Map<string, ApiKeyRecord[]> = new Map();
  private webhooks: Map<string, WebhookSubscription[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async createApiKey(
    developerUserId: string,
    keyName: string,
    scopes: string[] = ['READ_SERVICES', 'CREATE_BOOKINGS'],
  ): Promise<ApiKeyRecord> {
    const list = this.apiKeys.get(developerUserId) || [];
    const apiKey = `ecv_live_${Math.random().toString(36).substring(2, 16)}${Math.random().toString(36).substring(2, 16)}`;

    const record: ApiKeyRecord = {
      id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      developerUserId,
      keyName,
      apiKey,
      scopes,
      rateLimitPerMinute: 600,
      active: true,
      createdAt: new Date(),
    };

    list.push(record);
    this.apiKeys.set(developerUserId, list);
    return record;
  }

  async registerWebhook(
    developerUserId: string,
    targetUrl: string,
    events: string[],
  ): Promise<WebhookSubscription> {
    const list = this.webhooks.get(developerUserId) || [];
    const secret = `whsec_${Math.random().toString(36).substring(2, 18)}`;

    const sub: WebhookSubscription = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      developerUserId,
      targetUrl,
      events,
      secret,
      active: true,
    };

    list.push(sub);
    this.webhooks.set(developerUserId, list);
    return sub;
  }

  async getApiKeys(developerUserId: string): Promise<ApiKeyRecord[]> {
    return this.apiKeys.get(developerUserId) || [];
  }

  async getWebhooks(developerUserId: string): Promise<WebhookSubscription[]> {
    return this.webhooks.get(developerUserId) || [];
  }
}
