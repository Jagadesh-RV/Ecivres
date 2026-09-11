import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
  });

  it('should award points, calculate VIP tier, and increase streak', async () => {
    const profile = await service.awardPointsForBooking('user_100', 150);
    expect(profile.points).toBeGreaterThan(1200);
    expect(profile.streakDays).toBeGreaterThan(0);
    expect(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM_VIP']).toContain(profile.vipTier);
  });

  it('should return top provider leaderboard', async () => {
    const leaderboard = await service.getTopProviderLeaderboard();
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[0].badgeTitle).toContain('Top Rated');
  });
});
