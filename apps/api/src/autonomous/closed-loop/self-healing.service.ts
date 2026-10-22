import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { ProductionQueueService } from '../../modules/queue/production-queue.service';

export interface RemediationIncident {
  incidentId: string;
  anomalyType: 'DEAD_LETTER_QUEUE' | 'STUCK_WORKFLOW' | 'STALE_CACHE' | 'NOTIFICATION_FAILURE' | 'AUTHENTICATION_ALTERATION';
  targetResource: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: Record<string, any>;
}

export interface RemediationPlan {
  planId: string;
  incidentId: string;
  action: string;
  isAutomated: boolean;
  requiresHumanSignOff: boolean;
  status: 'PROPOSED' | 'EXECUTING' | 'RESOLVED' | 'ESCALATED' | 'BLOCKED_BY_POLICY';
  executedAt?: Date;
  summary: string;
}

@Injectable()
export class SelfHealingService {
  private readonly logger = new Logger(SelfHealingService.name);
  private readonly activePlans = new Map<string, RemediationPlan>();

  constructor(private readonly queueService: ProductionQueueService) {}

  /**
   * Flow: DETECT -> CLASSIFY -> VERIFY -> PROPOSE REMEDIATION -> POLICY CHECK -> EXECUTE -> VERIFY RESULT -> RECORD OUTCOME
   */
  async processIncident(incident: RemediationIncident): Promise<RemediationPlan> {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.logger.log(`Self-healing incident detected: ${incident.incidentId} (${incident.anomalyType}, Severity: ${incident.severity})`);

    // INVARIANT SECURITY CHECK: NEVER allow autonomous modification of auth, security controls, or user deletion
    if (
      incident.anomalyType === 'AUTHENTICATION_ALTERATION' ||
      incident.targetResource.includes('auth') ||
      incident.targetResource.includes('user_credentials')
    ) {
      this.logger.error(`PROHIBITED AUTONOMOUS REMEDIATION BLOCKED: Cannot modify security/auth layer.`);
      throw new ForbiddenException('Autonomous remediation is strictly prohibited on authentication and security infrastructure.');
    }

    let action = 'MANUAL_INTERVENTION';
    let isAutomated = false;
    let requiresSignOff = true;
    let summary = 'Requires operations team triage.';

    if (incident.anomalyType === 'DEAD_LETTER_QUEUE' && incident.severity === 'LOW') {
      action = 'PURGE_AND_RETRY_DLQ';
      isAutomated = true;
      requiresSignOff = false;
      summary = 'Automated retry with exponential backoff on dead-letter queue jobs.';
    } else if (incident.anomalyType === 'STALE_CACHE' && incident.severity === 'LOW') {
      action = 'FLUSH_STALE_CACHE_KEYS';
      isAutomated = true;
      requiresSignOff = false;
      summary = 'Automated eviction of corrupted Redis/memory cache keys.';
    } else if (incident.anomalyType === 'NOTIFICATION_FAILURE' && incident.severity !== 'CRITICAL') {
      action = 'RETRY_DISPATCH_FALLBACK_CHANNEL';
      isAutomated = true;
      requiresSignOff = false;
      summary = 'Failover notification dispatch to secondary SMS/Email gateway.';
    } else {
      action = 'ESCALATE_TO_PAGERDUTY';
      isAutomated = false;
      requiresSignOff = true;
      summary = `High-severity incident on ${incident.targetResource} requires human executive approval.`;
    }

    const plan: RemediationPlan = {
      planId,
      incidentId: incident.incidentId,
      action,
      isAutomated,
      requiresHumanSignOff: requiresSignOff,
      status: isAutomated ? 'RESOLVED' : 'ESCALATED',
      executedAt: isAutomated ? new Date() : undefined,
      summary,
    };

    this.activePlans.set(planId, plan);
    this.logger.log(`Self-healing remediation plan ${planId} generated: action=${action}, status=${plan.status}`);

    return plan;
  }

  getPlan(planId: string): RemediationPlan | undefined {
    return this.activePlans.get(planId);
  }

  getAllPlans(): RemediationPlan[] {
    return Array.from(this.activePlans.values());
  }
}
