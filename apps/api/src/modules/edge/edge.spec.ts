import { Test, TestingModule } from '@nestjs/testing';
import { EdgeRouterService } from './edge-router.service';
import { EdgeCacheService } from './edge-cache.service';

describe('Edge Computing Module Services', () => {
  let edgeRouter: EdgeRouterService;
  let edgeCache: EdgeCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeRouterService, EdgeCacheService],
    }).compile();

    edgeRouter = module.get<EdgeRouterService>(EdgeRouterService);
    edgeCache = module.get<EdgeCacheService>(EdgeCacheService);
  });

  it('should resolve optimal PoP region with sub-12ms latency target', async () => {
    const route = await edgeRouter.resolveOptimalEdgeRoute({
      clientIp: '198.51.100.45',
      requestPath: '/api/v1/bookings',
      longitude: -122.33,
    });
    expect(route.routeId).toBeDefined();
    expect(route.closestPopRegion).toBe('us-west-sea-1');
    expect(route.estimatedLatencyMs).toBeLessThanOrEqual(12);
  });

  it('should synchronize edge cache across 4 global PoP regions', async () => {
    const sync = await edgeCache.syncEdgeCache('service_cat_list', 3600);
    expect(sync.syncedRegions.length).toBe(4);
    expect(sync.ttlSeconds).toBe(3600);
  });
});
