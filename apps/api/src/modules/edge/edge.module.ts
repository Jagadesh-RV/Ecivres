import { Module } from '@nestjs/common';
import { EdgeRouterService } from './edge-router.service';
import { EdgeCacheService } from './edge-cache.service';
import { EdgeController } from './edge.controller';

@Module({
  controllers: [EdgeController],
  providers: [EdgeRouterService, EdgeCacheService],
  exports: [EdgeRouterService, EdgeCacheService],
})
export class EdgeModule {}
