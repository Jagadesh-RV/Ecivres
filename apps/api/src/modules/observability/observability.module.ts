import { Module } from '@nestjs/common';
import { OpenTelemetryService } from './opentelemetry.service';
import { LokiLoggerService } from './loki-logger.service';
import { SyntheticBenchmarkService } from './synthetic-benchmark.service';
import { ObservabilityController } from './observability.controller';

@Module({
  controllers: [ObservabilityController],
  providers: [OpenTelemetryService, LokiLoggerService, SyntheticBenchmarkService],
  exports: [OpenTelemetryService, LokiLoggerService, SyntheticBenchmarkService],
})
export class ObservabilityModule {}
