import { Injectable } from '@nestjs/common';

export interface ParsedSearchQuery {
  rawQuery: string;
  categoryKeyword?: string;
  intent: 'BOOKING_SEARCH' | 'PROVIDER_SEARCH' | 'PRICE_INQUIRY' | 'GENERAL_SEARCH';
  bookingDate?: Date;
  timeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME';
  nearMe: boolean;
  maxDistanceKm?: number;
  maxPrice?: number;
}

@Injectable()
export class SearchParserService {
  /**
   * Extracts search intent from user natural language query
   */
  extractIntent(query: string): 'BOOKING_SEARCH' | 'PROVIDER_SEARCH' | 'PRICE_INQUIRY' | 'GENERAL_SEARCH' {
    const lower = query.toLowerCase();

    if (/\b(book|booking|schedule|reserve|slot|appointment|tomorrow|today|morning|afternoon|evening)\b/.test(lower)) {
      return 'BOOKING_SEARCH';
    }

    if (/\b(provider|contractor|technician|plumber|electrician|cleaner|mechanic|best|top|rated|pro)\b/.test(lower)) {
      return 'PROVIDER_SEARCH';
    }

    if (/\b(price|cost|cheap|budget|rate|under|affordable|\$|\d+ dollars)\b/.test(lower)) {
      return 'PRICE_INQUIRY';
    }

    return 'GENERAL_SEARCH';
  }

  /**
   * Recognizes booking dates and preferred time slots from natural language text
   */
  recognizeBookingDate(query: string): { bookingDate?: Date; timeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME' } {
    const lower = query.toLowerCase();
    const now = new Date();
    let bookingDate: Date | undefined = undefined;
    let timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME' = 'ANYTIME';

    if (lower.includes('today')) {
      bookingDate = new Date(now);
    } else if (lower.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      bookingDate = tomorrow;
    } else if (lower.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      bookingDate = nextWeek;
    } else if (lower.includes('weekend')) {
      const weekend = new Date(now);
      const day = weekend.getDay();
      const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
      weekend.setDate(weekend.getDate() + daysUntilSaturday);
      bookingDate = weekend;
    }

    if (lower.includes('morning') || lower.includes('am')) {
      timeSlot = 'MORNING';
    } else if (lower.includes('afternoon') || lower.includes('noon')) {
      timeSlot = 'AFTERNOON';
    } else if (lower.includes('evening') || lower.includes('night') || lower.includes('pm')) {
      timeSlot = 'EVENING';
    }

    return { bookingDate, timeSlot };
  }

  parseQuery(query: string): ParsedSearchQuery {
    const rawQuery = query ? query.trim() : '';
    const intent = this.extractIntent(rawQuery);
    const { bookingDate, timeSlot } = this.recognizeBookingDate(rawQuery);

    return {
      rawQuery,
      intent,
      bookingDate,
      timeSlot,
      nearMe: false,
    };
  }
}
