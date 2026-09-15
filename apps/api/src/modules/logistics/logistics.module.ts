import { Module } from '@nestjs/common';
import { RouteOptimizerService } from './route-optimizer.service';
import { TrafficEtaService } from './traffic-eta.service';
import { LogisticsController } from './logistics.controller';

@Module({
  controllers: [LogisticsController],
  providers: [RouteOptimizerService, TrafficEtaService],
  exports: [RouteOptimizerService, TrafficEtaService],
})
export class LogisticsModule {}
