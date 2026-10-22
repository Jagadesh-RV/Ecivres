import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type KillSwitchScope = 'GLOBAL' | 'TENANT' | 'AGENT' | 'ACTION' | 'EXPERIMENT';

export interface KillSwitchTriggerDto {
  scope: KillSwitchScope;
  scopeId?: string; // tenantId, agentId, actionType, or experimentId
  reason: string;
  triggeredBy: string;
  isEmergency?: boolean;
}

export interface KillSwitchStatus {
  isGlobalActive: boolean;
  tenantKillSwitches: string[];
  agentKillSwitches: string[];
  actionKillSwitches: string[];
  experimentKillSwitches: string[];
  lastTriggeredAt?: Date;
}

@Injectable()
export class KillSwitchService {
  private readonly logger = new Logger(KillSwitchService.name);
  private isGlobalActive = false;
  private readonly tenantSwitches = new Set<string>();
  private readonly agentSwitches = new Set<string>();
  private readonly actionSwitches = new Set<string>();
  private readonly experimentSwitches = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  async activateKillSwitch(dto: KillSwitchTriggerDto): Promise<{ success: boolean; scope: KillSwitchScope; scopeId?: string }> {
    const now = new Date();

    switch (dto.scope) {
      case 'GLOBAL':
        this.isGlobalActive = true;
        this.logger.error(`GLOBAL AUTONOMOUS EXECUTION KILL SWITCH ACTIVATED by ${dto.triggeredBy}. Reason: ${dto.reason}`);
        break;
      case 'TENANT':
        if (dto.scopeId) this.tenantSwitches.add(dto.scopeId);
        this.logger.warn(`Tenant kill switch activated for tenant ${dto.scopeId} by ${dto.triggeredBy}.`);
        break;
      case 'AGENT':
        if (dto.scopeId) this.agentSwitches.add(dto.scopeId);
        this.logger.warn(`Agent kill switch activated for agent ${dto.scopeId} by ${dto.triggeredBy}.`);
        break;
      case 'ACTION':
        if (dto.scopeId) this.actionSwitches.add(dto.scopeId);
        this.logger.warn(`Action kill switch activated for action type ${dto.scopeId} by ${dto.triggeredBy}.`);
        break;
      case 'EXPERIMENT':
        if (dto.scopeId) this.experimentSwitches.add(dto.scopeId);
        this.logger.warn(`Experiment kill switch activated for experiment ${dto.scopeId} by ${dto.triggeredBy}.`);
        break;
    }

    try {
      await this.prisma.killSwitchLog.create({
        data: {
          id: `kill_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          scope: dto.scope,
          scopeId: dto.scopeId,
          triggerReason: dto.reason,
          triggeredBy: dto.triggeredBy,
          isEmergency: dto.isEmergency !== undefined ? dto.isEmergency : true,
          activatedAt: now,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed writing kill switch log to database: ${err.message}`);
    }

    return { success: true, scope: dto.scope, scopeId: dto.scopeId };
  }

  async deactivateKillSwitch(scope: KillSwitchScope, scopeId?: string, actorId: string = 'ADMIN'): Promise<boolean> {
    switch (scope) {
      case 'GLOBAL':
        this.isGlobalActive = false;
        this.logger.log(`GLOBAL KILL SWITCH DEACTIVATED by ${actorId}.`);
        break;
      case 'TENANT':
        if (scopeId) this.tenantSwitches.delete(scopeId);
        break;
      case 'AGENT':
        if (scopeId) this.agentSwitches.delete(scopeId);
        break;
      case 'ACTION':
        if (scopeId) this.actionSwitches.delete(scopeId);
        break;
      case 'EXPERIMENT':
        if (scopeId) this.experimentSwitches.delete(scopeId);
        break;
    }
    return true;
  }

  assertExecutionAllowed(tenantId?: string, agentId?: string, actionType?: string, experimentId?: string): void {
    if (this.isGlobalActive) {
      throw new ForbiddenException('Autonomous execution is halted platform-wide by Global Emergency Kill Switch.');
    }
    if (tenantId && this.tenantSwitches.has(tenantId)) {
      throw new ForbiddenException(`Autonomous execution is halted for tenant '${tenantId}' by active Kill Switch.`);
    }
    if (agentId && this.agentSwitches.has(agentId)) {
      throw new ForbiddenException(`Autonomous agent '${agentId}' is suspended by active Kill Switch.`);
    }
    if (actionType && this.actionSwitches.has(actionType)) {
      throw new ForbiddenException(`Action type '${actionType}' is suspended by active Kill Switch.`);
    }
    if (experimentId && this.experimentSwitches.has(experimentId)) {
      throw new ForbiddenException(`Experiment '${experimentId}' is halted by active Kill Switch.`);
    }
  }

  getStatus(): KillSwitchStatus {
    return {
      isGlobalActive: this.isGlobalActive,
      tenantKillSwitches: Array.from(this.tenantSwitches),
      agentKillSwitches: Array.from(this.agentSwitches),
      actionKillSwitches: Array.from(this.actionSwitches),
      experimentKillSwitches: Array.from(this.experimentSwitches),
      lastTriggeredAt: new Date(),
    };
  }
}
