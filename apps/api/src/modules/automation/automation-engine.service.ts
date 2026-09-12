import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type AutomationTrigger = 'BOOKING_CREATED' | 'SERVICE_COMPLETED' | 'REVIEW_SUBMITTED' | 'PAYMENT_FAILED';
export type AutomationAction = 'AUTO_ACCEPT' | 'SEND_REMINDER' | 'ISSUE_REFUND' | 'SCHEDULE_FOLLOWUP' | 'APPLY_DISCOUNT';

export interface AutomationRule {
  id: string;
  providerId?: string;
  title: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  conditions: { field: string; operator: 'EQUALS' | 'LESS_THAN' | 'GREATER_THAN'; value: any }[];
  delayMinutes: number;
  active: boolean;
}

export interface WorkflowExecutionLog {
  ruleId: string;
  triggerEvent: string;
  executedAt: Date;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  details: string;
}

@Injectable()
export class AutomationEngineService {
  private readonly logger = new Logger(AutomationEngineService.name);
  private rules: Map<string, AutomationRule> = new Map();
  private executionLogs: WorkflowExecutionLog[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async createRule(
    dto: Omit<AutomationRule, 'id'>,
  ): Promise<AutomationRule> {
    const rule: AutomationRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...dto,
    };
    this.rules.set(rule.id, rule);
    return rule;
  }

  async getRules(providerId?: string): Promise<AutomationRule[]> {
    const all = Array.from(this.rules.values());
    if (providerId) {
      return all.filter((r) => r.providerId === providerId || !r.providerId);
    }
    return all;
  }

  async triggerEvent(event: AutomationTrigger, payload: any): Promise<WorkflowExecutionLog[]> {
    const matchedRules = Array.from(this.rules.values()).filter(
      (r) => r.active && r.trigger === event,
    );

    const logs: WorkflowExecutionLog[] = [];

    for (const rule of matchedRules) {
      let conditionsMet = true;

      for (const cond of rule.conditions) {
        const payloadVal = payload[cond.field];
        if (cond.operator === 'EQUALS' && payloadVal !== cond.value) conditionsMet = false;
        if (cond.operator === 'LESS_THAN' && payloadVal >= cond.value) conditionsMet = false;
        if (cond.operator === 'GREATER_THAN' && payloadVal <= cond.value) conditionsMet = false;
      }

      if (conditionsMet) {
        const log: WorkflowExecutionLog = {
          ruleId: rule.id,
          triggerEvent: event,
          executedAt: new Date(),
          status: 'SUCCESS',
          details: `Executed action ${rule.action} with ${rule.delayMinutes}m delay.`,
        };
        logs.push(log);
        this.executionLogs.unshift(log);
      } else {
        logs.push({
          ruleId: rule.id,
          triggerEvent: event,
          executedAt: new Date(),
          status: 'SKIPPED',
          details: 'Conditions not met',
        });
      }
    }

    return logs;
  }

  async getLogs(): Promise<WorkflowExecutionLog[]> {
    return this.executionLogs;
  }
}
