import { Module } from '@nestjs/common';
import { RouteOptimizerService } from './route-optimizer.service';
import { TrafficEtaService } from './traffic-eta.service';
import { FleetTelemetryService } from './fleet-telemetry.service';
import { LogisticsController } from './logistics.controller';

@Module({
  controllers: [LogisticsController],
  providers: [RouteOptimizerService, TrafficEtaService, FleetTelemetryService],
  exports: [RouteOptimizerService, TrafficEtaService, FleetTelemetryService],
})
export class LogisticsModule {}
