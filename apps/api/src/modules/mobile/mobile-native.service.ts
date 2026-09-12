import { Injectable } from '@nestjs/common';

export interface HomeScreenWidgetPayload {
  userId: string;
  upcomingBooking?: {
    serviceName: string;
    providerName: string;
    scheduledTime: string;
    status: string;
  };
  loyaltyPoints: number;
  streakDays: number;
}

export interface VoiceCommandIntent {
  intent: 'SEARCH_SERVICE' | 'BOOK_EMERGENCY' | 'CHECK_STATUS' | 'CANCEL_BOOKING';
  confidenceScore: number;
  extractedQuery?: string;
}

@Injectable()
export class MobileNativeService {
  async getHomeScreenWidgetData(userId: string): Promise<HomeScreenWidgetPayload> {
    return {
      userId,
      upcomingBooking: {
        serviceName: 'Master Plumber Inspection',
        providerName: 'Marcus Vance',
        scheduledTime: 'Today at 02:00 PM',
        status: 'CONFIRMED',
      },
      loyaltyPoints: 1850,
      streakDays: 5,
    };
  }

  async parseVoiceCommand(transcript: string): Promise<VoiceCommandIntent> {
    const text = transcript.toLowerCase();

    if (text.includes('emergency') || text.includes('urgent') || text.includes('leak')) {
      return {
        intent: 'BOOK_EMERGENCY',
        confidenceScore: 0.95,
        extractedQuery: transcript,
      };
    }

    if (text.includes('status') || text.includes('when is my provider') || text.includes('arrival')) {
      return {
        intent: 'CHECK_STATUS',
        confidenceScore: 0.92,
      };
    }

    return {
      intent: 'SEARCH_SERVICE',
      confidenceScore: 0.88,
      extractedQuery: transcript,
    };
  }
}
