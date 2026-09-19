import { Module } from '@nestjs/common';
import { MunicipalDispatchService } from './municipal-dispatch.service';
import { InfrastructureMonitorService } from './infrastructure-monitor.service';
import { SmartCityController } from './smart-city.controller';

@Module({
  controllers: [SmartCityController],
  providers: [MunicipalDispatchService, InfrastructureMonitorService],
  exports: [MunicipalDispatchService, InfrastructureMonitorService],
})
export class SmartCityModule {}
