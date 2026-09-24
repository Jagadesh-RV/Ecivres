import { Module } from '@nestjs/common';
import { CanaryMetricsMonitorService } from './services/canary-metrics-monitor.service';
import { CanaryController } from './canary.controller';

@Module({
  controllers: [CanaryController],
  providers: [CanaryMetricsMonitorService],
  exports: [CanaryMetricsMonitorService],
})
export class CanaryModule {}
