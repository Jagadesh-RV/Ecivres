import { Injectable } from '@nestjs/common';
import { BaseIntegrationAdapter } from './base-integration.adapter';
import {
  IntegrationHealthCheckResult,
  IntegrationExecutionOptions,
} from '../interfaces/integration.interface';

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

export interface SendSmsPayload {
  phoneNumber: string;
  message: string;
}

@Injectable()
export class NotificationIntegrationAdapter extends BaseIntegrationAdapter {
  constructor() {
    super('COMMUNICATIONS_HUB', 'NOTIFICATION');
  }

  async healthCheck(): Promise<IntegrationHealthCheckResult> {
    const start = Date.now();
    return {
      providerName: this.providerName,
      providerType: this.providerType,
      status: 'HEALTHY',
      latencyMs: Date.now() - start + 8,
      lastCheckedAt: new Date(),
      details: 'Email and SMS relays operational.',
    };
  }

  protected async executeInternal<TInput, TOutput>(
    operation: string,
    payload: TInput,
    _options?: IntegrationExecutionOptions,
  ): Promise<TOutput> {
    switch (operation) {
      case 'send_email': {
        const p = payload as unknown as SendEmailPayload;
        const messageId = `msg_mail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        return {
          messageId,
          recipient: p.to,
          delivered: true,
          timestamp: new Date().toISOString(),
        } as unknown as TOutput;
      }

      case 'send_sms': {
        const p = payload as unknown as SendSmsPayload;
        const messageId = `msg_sms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        return {
          messageId,
          recipient: p.phoneNumber,
          delivered: true,
          timestamp: new Date().toISOString(),
        } as unknown as TOutput;
      }

      default:
        throw new Error(`Unsupported notification operation '${operation}'`);
    }
  }
}
