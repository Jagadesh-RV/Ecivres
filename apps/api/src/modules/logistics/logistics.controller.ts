import { Controller, Post, Body } from '@nestjs/common';
import { RouteOptimizerService, RouteWaypoint } from './route-optimizer.service';
import { TrafficEtaService } from './traffic-eta.service';

@Controller('logistics')
export class LogisticsController {
  constructor(
    private readonly routeOptimizer: RouteOptimizerService,
    private readonly trafficEta: TrafficEtaService,
  ) {}

  @Post('optimize-route')
  optimizeRoute(@Body() body: { providerId: string; waypoints: RouteWaypoint[] }) {
    return this.routeOptimizer.optimizeMultiStopRoute(body.providerId, body.waypoints || []);
  }

  @Post('recalculate-eta')
  recalculateEta(@Body() body: { bookingId: string; currentLat: number; currentLng: number; targetLat: number; targetLng: number }) {
    return this.trafficEta.recalculateRealtimeEta(body.bookingId, body.currentLat, body.currentLng, body.targetLat, body.targetLng);
  }
}
