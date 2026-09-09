import { Test, TestingModule } from '@nestjs/testing';
import { SearchParserService } from './search-parser.service';

describe('SearchParserService', () => {
  let service: SearchParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchParserService],
    }).compile();

    service = module.get<SearchParserService>(SearchParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractIntent', () => {
    it('should classify BOOKING_SEARCH queries', () => {
      const intent = service.extractIntent('Book AC repair tomorrow morning');
      expect(intent).toBe('BOOKING_SEARCH');
    });

    it('should classify PROVIDER_SEARCH queries', () => {
      const intent = service.extractIntent('Best plumber near me');
      expect(intent).toBe('PROVIDER_SEARCH');
    });

    it('should classify PRICE_INQUIRY queries', () => {
      const intent = service.extractIntent('Cheap house cleaning under $100');
      expect(intent).toBe('PRICE_INQUIRY');
    });
  });

  describe('recognizeBookingDate', () => {
    it('should recognize tomorrow and morning time slot', () => {
      const { bookingDate, timeSlot } = service.recognizeBookingDate('AC repair tomorrow morning');
      expect(bookingDate).toBeDefined();
      expect(timeSlot).toBe('MORNING');
    });

    it('should recognize weekend and evening time slot', () => {
      const { bookingDate, timeSlot } = service.recognizeBookingDate('Plumbing service this weekend evening');
      expect(bookingDate).toBeDefined();
      expect(timeSlot).toBe('EVENING');
    });
  });

  describe('recognizeLocationAndFilters', () => {
    it('should parse near me and price limit', () => {
      const { nearMe, maxDistanceKm, maxPrice } = service.recognizeLocationAndFilters('Electrician near me under $150');
      expect(nearMe).toBe(true);
      expect(maxDistanceKm).toBe(15);
      expect(maxPrice).toBe(150);
    });

    it('should parse explicit distance limit in km', () => {
      const { maxDistanceKm } = service.recognizeLocationAndFilters('Cleaner within 10 km');
      expect(maxDistanceKm).toBe(10);
    });
  });

  describe('parseQuery', () => {
    it('should perform full query extraction on complex sentence', () => {
      const result = service.parseQuery('AC repair near me tomorrow morning under $200');

      expect(result.intent).toBe('BOOKING_SEARCH');
      expect(result.categoryKeyword).toBe('ac repair');
      expect(result.nearMe).toBe(true);
      expect(result.timeSlot).toBe('MORNING');
      expect(result.maxPrice).toBe(200);
      expect(result.bookingDate).toBeDefined();
    });
  });
});
