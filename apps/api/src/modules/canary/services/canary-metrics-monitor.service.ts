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
}
