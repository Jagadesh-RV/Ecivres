import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CommunityDiscussionService } from './services/community-discussion.service';

describe('CommunityDiscussionService', () => {
  let service: CommunityDiscussionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityDiscussionService],
    }).compile();

    service = module.get<CommunityDiscussionService>(CommunityDiscussionService);
  });

  it('should create a community post cleanly', () => {
    const res = service.createPost('u_1', 'Plumbing Tips for Winter', 'How to insulate pipes effectively', 'plumbing');
    expect(res.title).toBe('Plumbing Tips for Winter');
    expect(res.category).toBe('plumbing');
  });

  it('should return featured provider before/after showcases', () => {
    const res = service.getFeaturedProviderShowcases('plumbing');
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].beforeImageUrl).toBeDefined();
  });
});
