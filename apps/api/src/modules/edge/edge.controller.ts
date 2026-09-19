import { Controller, Post, Body } from '@nestjs/common';
import { EdgeRouteDto } from './dto/edge-route.dto';
import { EdgeRouterService } from './edge-router.service';
import { EdgeCacheService } from './edge-cache.service';

@Controller('edge')
export class EdgeController {
  constructor(
    private readonly edgeRouter: EdgeRouterService,
    private readonly edgeCache: EdgeCacheService,
  ) {}

  @Post('resolve-route')
  resolveRoute(@Body() dto: EdgeRouteDto) {
    return this.edgeRouter.resolveOptimalEdgeRoute(dto);
  }

  @Post('sync-cache')
  syncCache(@Body() body: { cacheKey: string; ttlSeconds?: number }) {
    return this.edgeCache.syncEdgeCache(body.cacheKey, body.ttlSeconds || 3600);
  }
}
