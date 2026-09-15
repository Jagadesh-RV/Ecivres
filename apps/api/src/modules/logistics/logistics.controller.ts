import { Controller, Post, Body } from '@nestjs/common';
import { RouteOptimizerService, RouteWaypoint } from './route-optimizer.service';
import { TrafficEtaService } from './traffic-eta.service';
import { FleetTelemetryService } from './fleet-telemetry.service';
import { ProviderTelemetryDto } from './dto/telemetry.dto';

@Controller('logistics')
export class LogisticsController {
  constructor(
    private readonly routeOptimizer: RouteOptimizerService,
    private readonly trafficEta: TrafficEtaService,
    private readonly telemetryService: FleetTelemetryService,
  ) {}

  @Post('optimize-route')
  optimizeRoute(@Body() body: { providerId: string; waypoints: RouteWaypoint[] }) {
    return this.routeOptimizer.optimizeMultiStopRoute(body.providerId, body.waypoints || []);
  }

  @Post('recalculate-eta')
  recalculateEta(@Body() body: { bookingId: string; currentLat: number; currentLng: number; targetLat: number; targetLng: number }) {
    return this.trafficEta.recalculateRealtimeEta(body.bookingId, body.currentLat, body.currentLng, body.targetLat, body.targetLng);
  }

  @Post('telemetry')
  reportTelemetry(@Body() dto: ProviderTelemetryDto) {
    return this.telemetryService.processTelemetry(dto);
  }
}
