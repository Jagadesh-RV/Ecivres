import { QueryAnalyzerService } from './query-analyzer.service';

describe('QueryAnalyzerService', () => {
  let analyzer: QueryAnalyzerService;

  beforeEach(() => {
    analyzer = new QueryAnalyzerService();
  });

  it('should flag queries exceeding 200ms threshold as slow', () => {
    const result = analyzer.recordQueryTiming('SELECT * FROM "Booking" WHERE status = PENDING', 350);
    expect(result.isSlow).toBe(true);
    expect(result.durationMs).toBe(350);
  });

  it('should mark fast queries under 200ms as not slow', () => {
    const result = analyzer.recordQueryTiming('SELECT id FROM "User" WHERE id = 1', 12);
    expect(result.isSlow).toBe(false);
  });
});
