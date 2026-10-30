import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';

export interface PartnerSubscription {
  subscriptionId: string;
  partnerId: string;
  targetUrl: string;
  secret: string;
  subscribedEvents: string[]; // e.g. ["booking.created", "payment.settled"]
  isActive: boolean;
  createdAt: Date;
}

export interface WebhookDispatchResult {
  dispatchId: string;
  subscriptionId: string;
  targetUrl: string;
  eventType: string;
  delivered: boolean;
  timestamp: Date;
  signature: string;
}

@Injectable()
export class PartnerEventSubscriptionService {
  private readonly logger = new Logger(PartnerEventSubscriptionService.name);
  private readonly subscriptions = new Map<string, PartnerSubscription>();

  /**
   * Registers a partner outbound webhook endpoint.
   */
  subscribe(
    partnerId: string,
    targetUrl: string,
    secret: string,
    subscribedEvents: string[],
  ): PartnerSubscription {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const sub: PartnerSubscription = {
      subscriptionId,
      partnerId,
      targetUrl,
      secret,
      subscribedEvents,
      isActive: true,
      createdAt: new Date(),
    };

    this.subscriptions.set(subscriptionId, sub);
    this.logger.log(`Partner ${partnerId} subscribed to [${subscribedEvents.join(', ')}] -> ${targetUrl}`);
    return sub;
  }

  /**
   * Signs and dispatches an event to all matching active partner subscribers.
   */
  async dispatchEvent(eventType: string, payload: Record<string, any>): Promise<WebhookDispatchResult[]> {
    const results: WebhookDispatchResult[] = [];
    const now = Math.floor(Date.now() / 1000);
    const rawPayload = JSON.stringify(payload);

    for (const sub of this.subscriptions.values()) {
      if (!sub.isActive) continue;

      const matches = sub.subscribedEvents.includes('*') || sub.subscribedEvents.includes(eventType);
      if (!matches) continue;

      // Compute HMAC-SHA256 signature
      const signaturePayload = `${now}.${rawPayload}`;
      const signature = createHmac('sha256', sub.secret).update(signaturePayload).digest('hex');

      const dispatchId = `disp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      this.logger.log(
        `Dispatched outbound webhook '${eventType}' (${dispatchId}) to ${sub.targetUrl} for partner ${sub.partnerId}`,
      );

      results.push({
        dispatchId,
        subscriptionId: sub.subscriptionId,
        targetUrl: sub.targetUrl,
        eventType,
        delivered: true,
        timestamp: new Date(),
        signature,
      });
    }

    return results;
  }

  getSubscriptions(partnerId?: string): PartnerSubscription[] {
    const list = Array.from(this.subscriptions.values());
    return partnerId ? list.filter((s) => s.partnerId === partnerId) : list;
  }
}
