import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CanaryMetricsMonitorService {
  private readonly logger = new Logger(CanaryMetricsMonitorService.name);

  async checkErrorRateThreshold(canaryVersion: string, currentErrorRatePercent: number) {
    const maxAllowedRate = 1.0; // 1.0% max error threshold
    const isBreached = currentErrorRatePercent > maxAllowedRate;
    this.logger.log(`Canary ${canaryVersion} Error Rate Check: ${currentErrorRatePercent}% (Max: ${maxAllowedRate}%): Breached=${isBreached}`);
    return {
      canaryVersion,
      currentErrorRatePercent,
      maxAllowedRate,
      status: isBreached ? 'BREACHED' : 'HEALTHY',
    };
  }

  async checkP95LatencyThreshold(canaryVersion: string, p95LatencyMs: number) {
    const maxAllowedP95 = 500; // 500ms P95 latency limit
    const isBreached = p95LatencyMs > maxAllowedP95;
    this.logger.log(`Canary ${canaryVersion} P95 Latency Check: ${p95LatencyMs}ms (Max: ${maxAllowedP95}ms): Breached=${isBreached}`);
    return {
      canaryVersion,
      p95LatencyMs,
      maxAllowedP95,
      status: isBreached ? 'BREACHED' : 'HEALTHY',
    };
  }
}
