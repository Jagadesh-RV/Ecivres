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
   * Provider Knowledge Base FAQ Engine
   */
  processProviderFaq(query: string): AssistantResponse {
    const text = query.toLowerCase();

    if (text.includes('payout') || text.includes('withdraw') || text.includes('bank') || text.includes('earnings')) {
      return {
        reply: 'Provider Payouts are processed weekly every Monday via Stripe Connect or Direct Bank Transfer. Minimum withdrawal threshold is $50.',
        suggestions: ['View Earnings Ledger', 'Update Payout Bank Account', 'Stripe Connect Status'],
        recommendedAction: 'VIEW_FAQ',
      };
    }

    if (text.includes('commission') || text.includes('fee') || text.includes('rate')) {
      return {
        reply: 'EcivreS charges a standard 10% marketplace commission on completed jobs. Premium tier subscribers receive a reduced 5% commission rate.',
        suggestions: ['Upgrade to Premium', 'Compare Subscription Plans'],
        recommendedAction: 'VIEW_FAQ',
      };
    }

    if (text.includes('cancel') || text.includes('reschedule') || text.includes('dispute')) {
      return {
        reply: 'You can reschedule or cancel a booking up to 2 hours before the scheduled appointment. For customer dispute resolution, file a report via the Support Queue.',
        suggestions: ['View Open Bookings', 'File Customer Report'],
        recommendedAction: 'VIEW_FAQ',
      };
    }

    return {
      reply: 'Welcome to Provider Support! Ask me about Payouts, Marketplace Fees, Schedule Rules, or Customer Disputes.',
      suggestions: ['How do payouts work?', 'Marketplace Commission Rates', 'Cancellation Policy'],
      recommendedAction: 'VIEW_FAQ',
    };
  }

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
    if (context.userRole === 'PROVIDER') {
      return this.processProviderFaq(context.message);
    }

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
