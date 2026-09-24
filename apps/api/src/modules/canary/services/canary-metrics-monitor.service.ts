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

  async evaluateAutomaticRollback(canaryVersion: string, errorRatePercent: number, p95LatencyMs: number) {
    const errCheck = await this.checkErrorRateThreshold(canaryVersion, errorRatePercent);
    const latCheck = await this.checkP95LatencyThreshold(canaryVersion, p95LatencyMs);
    const triggerRollback = errCheck.status === 'BREACHED' || latCheck.status === 'BREACHED';
    
    if (triggerRollback) {
      this.logger.error(`AUTOMATIC CANARY ROLLBACK TRIGGERED FOR ${canaryVersion}`);
    }

    return {
      canaryVersion,
      triggerRollback,
      action: triggerRollback ? 'IMMEDIATE_ROLLBACK_TO_STABLE' : 'CONTINUE_ROLLOUT',
    };
  }

  async updateTrafficWeight(canaryVersion: string, targetWeightPercent: number) {
    this.logger.log(`Updating canary ${canaryVersion} traffic allocation weight to ${targetWeightPercent}%`);
    return {
      canaryVersion,
      activeTrafficWeightPercent: targetWeightPercent,
      stableTrafficWeightPercent: 100 - targetWeightPercent,
    };
  }
}
