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
  parseQuery(query: string): ParsedSearchQuery {
    const rawQuery = query ? query.trim() : '';
    return {
      rawQuery,
      intent: 'GENERAL_SEARCH',
      nearMe: false,
    };
  }
}
