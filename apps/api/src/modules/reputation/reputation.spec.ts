import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { TrustScoreService } from './services/trust-score.service';

describe('TrustScoreService', () => {
  let service: TrustScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrustScoreService],
    }).compile();

    service = module.get<TrustScoreService>(TrustScoreService);
  });

  it('should calculate high trust score for verified provider with high ratings', () => {
    const res = service.calculateTrustScore(true, 4.9, 100, 1.0);
    expect(res.trustScore).toBeGreaterThanOrEqual(95);
  });

  it('should grant TOP_RATED_ELITE badge for score >= 90', () => {
    const res = service.evaluateVerifiedBadges(95, true, true);
    expect(res.badges).toContain('TOP_RATED_ELITE');
    expect(res.badges).toContain('BACKGROUND_VERIFIED');
    expect(res.badges).toContain('INSURED_PROVIDER');
  });
});
