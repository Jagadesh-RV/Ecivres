import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WorkflowSloConfig {
  workflowName: string;
  targetAvailability: number; // e.g. 99.9%
  latencyTargetMs: number;     // e.g. 250ms
  windowDays: number;          // e.g. 30
}

export interface SloSnapshot {
  workflowName: string;
  targetAvailability: number;
  currentAvailability: number;
  latencyTargetMs: number;
  p95LatencyMs: number;
  totalEvents: number;
  failedEvents: number;
  errorBudgetRemainingPercent: number;
  burnRate: number;
  budgetStatus: 'HEALTHY' | 'WARNING' | 'EXHAUSTED';
  recommendedAction: string;
}

@Injectable()
export class SloTrackerService {
  private readonly logger = new Logger(SloTrackerService.name);

  // Default SLO definitions for primary marketplace workflows
  private readonly sloConfigs = new Map<string, WorkflowSloConfig>([
    [
      'authentication',
      { workflowName: 'authentication', targetAvailability: 99.95, latencyTargetMs: 150, windowDays: 30 },
    ],
    [
      'service_discovery',
      { workflowName: 'service_discovery', targetAvailability: 99.9, latencyTargetMs: 200, windowDays: 30 },
    ],
    [
      'booking_lifecycle',
      { workflowName: 'booking_lifecycle', targetAvailability: 99.99, latencyTargetMs: 300, windowDays: 30 },
    ],
    [
      'payment_processing',
      { workflowName: 'payment_processing', targetAvailability: 99.99, latencyTargetMs: 500, windowDays: 30 },
    ],
    [
      'webhook_ingestion',
      { workflowName: 'webhook_ingestion', targetAvailability: 99.9, latencyTargetMs: 250, windowDays: 30 },
    ],
  ]);

  // In-memory aggregators
  private readonly eventRecords = new Map<
    string,
    { total: number; failed: number; latencies: number[] }
  >();

  constructor(private readonly prisma: PrismaService) {
    for (const key of this.sloConfigs.keys()) {
      this.eventRecords.set(key, { total: 0, failed: 0, latencies: [] });
    }
  }

  /**
   * Records a user or platform workflow transaction event against its SLO.
   */
  async recordWorkflowEvent(
    workflowName: string,
    durationMs: number,
    success: boolean,
  ): Promise<SloSnapshot> {
    const config = this.sloConfigs.get(workflowName) || {
      workflowName,
      targetAvailability: 99.9,
      latencyTargetMs: 300,
      windowDays: 30,
    };

    let record = this.eventRecords.get(workflowName);
    if (!record) {
      record = { total: 0, failed: 0, latencies: [] };
      this.eventRecords.set(workflowName, record);
    }

    record.total++;
    // Failure condition: explicitly not successful OR severely breached latency (> 3x target)
    if (!success || durationMs > config.latencyTargetMs * 3) {
      record.failed++;
    }

    // Keep rolling latency buffer
    if (record.latencies.length >= 500) {
      record.latencies.shift();
    }
    record.latencies.push(durationMs);

    const snapshot = this.calculateSloSnapshot(config, record);

    // If budget drops to EXHAUSTED or burn rate spikes, emit alert
    if (snapshot.budgetStatus === 'EXHAUSTED' || snapshot.burnRate > 2.0) {
      this.logger.error(
        `SLO ALERT: Error budget ${snapshot.budgetStatus} for workflow '${workflowName}'! Burn rate: ${snapshot.burnRate.toFixed(2)}x. Remaining budget: ${snapshot.errorBudgetRemainingPercent.toFixed(1)}%`,
      );
    }

    // Best-effort database synchronization
    this.persistSnapshot(snapshot).catch(() => {});

    return snapshot;
  }

  /**
   * Retrieves current SLO snapshot for a specific workflow.
   */
  getSloSnapshot(workflowName: string): SloSnapshot {
    const config = this.sloConfigs.get(workflowName) || {
      workflowName,
      targetAvailability: 99.9,
      latencyTargetMs: 300,
      windowDays: 30,
    };
    const record = this.eventRecords.get(workflowName) || { total: 0, failed: 0, latencies: [] };
    return this.calculateSloSnapshot(config, record);
  }

  /**
   * Retrieves all registered SLO snapshots across the platform.
   */
  getAllSloSnapshots(): SloSnapshot[] {
    const snapshots: SloSnapshot[] = [];
    for (const [key, config] of this.sloConfigs.entries()) {
      const record = this.eventRecords.get(key) || { total: 0, failed: 0, latencies: [] };
      snapshots.push(this.calculateSloSnapshot(config, record));
    }
    return snapshots;
  }

  /**
   * Calculates availability, p95 latency, error budget remaining, and burn rate.
   */
  private calculateSloSnapshot(
    config: WorkflowSloConfig,
    record: { total: number; failed: number; latencies: number[] },
  ): SloSnapshot {
    const total = record.total;
    const failed = record.failed;

    // Calculate availability percentage
    const currentAvailability =
      total > 0
        ? Math.round(((total - failed) / total) * 10000) / 100
        : 100.0;

    // Calculate p95 latency
    let p95Latency = 0;
    if (record.latencies.length > 0) {
      const sorted = [...record.latencies].sort((a, b) => a - b);
      p95Latency = sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1];
    }

    // Error budget calculation
    const allowedFailureRate = Math.max(0.001, 100 - config.targetAvailability);
    const actualFailureRate = total > 0 ? (failed / total) * 100 : 0;
    const errorBudgetRemainingPercent = Math.max(
      0,
      Math.min(100, Math.round((1 - actualFailureRate / allowedFailureRate) * 10000) / 100),
    );
    const burnRate = Math.round((actualFailureRate / allowedFailureRate) * 100) / 100;

    let budgetStatus: 'HEALTHY' | 'WARNING' | 'EXHAUSTED' = 'HEALTHY';
    let recommendedAction = 'Nominal operational status. Standard deployments permitted.';

    if (errorBudgetRemainingPercent <= 10 || burnRate > 2.0) {
      budgetStatus = 'EXHAUSTED';
      recommendedAction =
        'Error budget exhausted. Halt non-critical deployments; prioritize reliability remediations.';
    } else if (errorBudgetRemainingPercent <= 50 || burnRate > 1.0) {
      budgetStatus = 'WARNING';
      recommendedAction =
        'Error budget consumption elevated. Increase monitoring scrutiny on upcoming rollouts.';
    }

    return {
      workflowName: config.workflowName,
      targetAvailability: config.targetAvailability,
      currentAvailability,
      latencyTargetMs: config.latencyTargetMs,
      p95LatencyMs: p95Latency,
      totalEvents: total,
      failedEvents: failed,
      errorBudgetRemainingPercent,
      burnRate,
      budgetStatus,
      recommendedAction,
    };
  }

  private async persistSnapshot(s: SloSnapshot) {
    try {
      await (this.prisma as any).serviceLevelObjectiveRecord.upsert({
        where: { workflowName: s.workflowName },
        update: {
          currentAvailability: s.currentAvailability,
          p95LatencyMs: s.p95LatencyMs,
          errorBudgetRemainingPercent: s.errorBudgetRemainingPercent,
          burnRate: s.burnRate,
          budgetStatus: s.budgetStatus,
          totalEvents: s.totalEvents,
          failedEvents: s.failedEvents,
        },
        create: {
          workflowName: s.workflowName,
          targetAvailability: s.targetAvailability,
          currentAvailability: s.currentAvailability,
          latencyTargetMs: s.latencyTargetMs,
          p95LatencyMs: s.p95LatencyMs,
          errorBudgetRemainingPercent: s.errorBudgetRemainingPercent,
          burnRate: s.burnRate,
          budgetStatus: s.budgetStatus,
          totalEvents: s.totalEvents,
          failedEvents: s.failedEvents,
          windowDays: 30,
        },
      });
    } catch {
      // In fast path, DB persist errors are absorbed
    }
  }
}
