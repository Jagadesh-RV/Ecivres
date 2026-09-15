import { Controller, Post, Body } from '@nestjs/common';
import { SyntheticBenchmarkService } from './synthetic-benchmark.service';
import { SyntheticBenchmarkConfigDto } from './dto/benchmark-config.dto';

@Controller('observability')
export class ObservabilityController {
  constructor(private readonly benchmarkService: SyntheticBenchmarkService) {}

  @Post('synthetic-benchmark')
  runBenchmark(@Body() dto: SyntheticBenchmarkConfigDto) {
    return this.benchmarkService.runSyntheticBenchmark(dto);
  }
}
