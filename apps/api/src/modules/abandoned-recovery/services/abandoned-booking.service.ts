import { Injectable, Logger } from '@nestjs/common';

export interface AbandonedEventRecord {
  id: string;
  userId: string;
  eventType: 'SEARCH' | 'SERVICE_VIEW' | 'PROVIDER_VIEW' | 'BOOKING_FORM' | 'PAYMENT';
  metadataJson?: string;
  recovered: boolean;
  createdAt: Date;
}

@Injectable()
export class AbandonedBookingService {
  private readonly logger = new Logger(AbandonedBookingService.name);
  private readonly eventsMap = new Map<string, AbandonedEventRecord[]>();

  async recordAbandonedEvent(userId: string, eventType: 'SEARCH' | 'SERVICE_VIEW' | 'PROVIDER_VIEW' | 'BOOKING_FORM' | 'PAYMENT', metadata?: any) {
    const record: AbandonedEventRecord = {
      id: `abn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      eventType,
      metadataJson: metadata ? JSON.stringify(metadata) : undefined,
      recovered: false,
      createdAt: new Date(),
    };

    const userEvents = this.eventsMap.get(userId) || [];
    userEvents.push(record);
    this.eventsMap.set(userId, userEvents);

    this.logger.log(`Recorded abandoned event '${eventType}' for user ${userId}`);
    return record;
  }

  async getUnrecoveredEvents(userId: string) {
    const events = this.eventsMap.get(userId) || [];
    return events.filter((e) => !e.recovered);
  }
}
