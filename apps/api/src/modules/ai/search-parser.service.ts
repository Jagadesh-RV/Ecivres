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

  /**
   * Recognizes location filters, distance constraints, and price caps
   */
  recognizeLocationAndFilters(query: string): { nearMe: boolean; maxDistanceKm?: number; maxPrice?: number } {
    const lower = query.toLowerCase();
    const nearMe = /\b(near me|nearby|close by|local|around me)\b/.test(lower);

    let maxDistanceKm: number | undefined = undefined;
    const distanceMatch = lower.match(/within\s+(\d+)\s*(km|miles|mi)/);
    if (distanceMatch) {
      const val = parseInt(distanceMatch[1], 10);
      maxDistanceKm = distanceMatch[2] === 'km' ? val : Math.round(val * 1.60934);
    } else if (nearMe) {
      maxDistanceKm = 15; // default 15km for "near me"
    }

    let maxPrice: number | undefined = undefined;
    const priceMatch = lower.match(/(under|below|less than|\$)\s*(\d+)/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[2], 10);
    }

    return { nearMe, maxDistanceKm, maxPrice };
  }

  /**
   * Extracts target category or service keyword
   */
  extractCategoryKeyword(query: string): string | undefined {
    const lower = query.toLowerCase();
    const keywords = [
      'ac repair',
      'ac service',
      'plumbing',
      'plumber',
      'electrician',
      'electrical',
      'cleaning',
      'house cleaning',
      'appliance repair',
      'painting',
      'carpentry',
      'gardening',
      'pest control',
    ];

    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return kw;
      }
    }
    return undefined;
  }

  parseQuery(query: string): ParsedSearchQuery {
    const rawQuery = query ? query.trim() : '';
    const intent = this.extractIntent(rawQuery);
    const { bookingDate, timeSlot } = this.recognizeBookingDate(rawQuery);
    const { nearMe, maxDistanceKm, maxPrice } = this.recognizeLocationAndFilters(rawQuery);
    const categoryKeyword = this.extractCategoryKeyword(rawQuery);

    return {
      rawQuery,
      categoryKeyword,
      intent,
      bookingDate,
      timeSlot,
      nearMe,
      maxDistanceKm,
      maxPrice,
    };
  }
}
