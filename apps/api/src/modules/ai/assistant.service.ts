import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AssistantConversationContext {
  userId: string;
  userRole: 'CUSTOMER' | 'PROVIDER';
  message: string;
  bookingId?: string;
}

export interface AssistantResponse {
  reply: string;
  suggestions?: string[];
  recommendedAction?: 'BOOK_SERVICE' | 'VIEW_FAQ' | 'CONTACT_SUPPORT' | 'NONE';
  suggestedBooking?: {
    serviceName: string;
    estimatedPrice: number;
    availableSlot: string;
  };
}

@Injectable()
export class AiAssistantService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates AI booking suggestions based on user intent
   */
  async generateBookingSuggestions(serviceQuery: string): Promise<AssistantResponse['suggestedBooking']> {
    const lower = serviceQuery.toLowerCase();
    let serviceName = 'General Maintenance';
    let estimatedPrice = 75;

    if (lower.includes('ac') || lower.includes('cooling')) {
      serviceName = 'AC Deep Cleaning & Repair';
      estimatedPrice = 120;
    } else if (lower.includes('plumb') || lower.includes('sink') || lower.includes('pipe')) {
      serviceName = 'Emergency Plumbing Repair';
      estimatedPrice = 90;
    } else if (lower.includes('clean') || lower.includes('house')) {
      serviceName = 'Full Home Deep Cleaning';
      estimatedPrice = 150;
    } else if (lower.includes('electric') || lower.includes('wire') || lower.includes('switch')) {
      serviceName = 'Electrical Wiring & Inspection';
      estimatedPrice = 85;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    return {
      serviceName,
      estimatedPrice,
      availableSlot: `${dateStr} at 10:00 AM`,
    };
  }

  async processUserMessage(context: AssistantConversationContext): Promise<AssistantResponse> {
    const text = context.message.toLowerCase();

    if (/\b(book|need|hire|repair|fix|clean)\b/.test(text)) {
      const suggestedBooking = await this.generateBookingSuggestions(text);
      return {
        reply: `I recommend scheduling ${suggestedBooking?.serviceName} (Est. $${suggestedBooking?.estimatedPrice}). Next available slot: ${suggestedBooking?.availableSlot}. Would you like me to book this for you?`,
        suggestions: ['Confirm Booking', 'View Other Slots', 'Browse Providers'],
        recommendedAction: 'BOOK_SERVICE',
        suggestedBooking,
      };
    }

    return {
      reply: 'I am EcivreS AI Assistant. How can I help you today?',
      suggestions: ['Browse top services', 'Check booking status', 'Contact support'],
      recommendedAction: 'NONE',
    };
  }
}
