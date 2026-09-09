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

  parseQuery(query: string): ParsedSearchQuery {
    const rawQuery = query ? query.trim() : '';
    const intent = this.extractIntent(rawQuery);

    return {
      rawQuery,
      intent,
      nearMe: false,
    };
  }
}
