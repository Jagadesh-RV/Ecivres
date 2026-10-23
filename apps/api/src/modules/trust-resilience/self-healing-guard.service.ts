import { Injectable, Logger, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KillSwitchService } from '../../autonomous/closed-loop/kill-switch.service';
import { TriggerRemediationWithGuardDto } from './dto/trust-resilience-dtos';

export interface GuardedRemediationResult {
  remediationKey: string;
  actionType: string;
  status: 'EXECUTED' | 'LOOP_BLOCKED' | 'CONCURRENCY_BLOCKED' | 'KILL_SWITCH_BLOCKED';
  incidentCount: number;
  maxAllowedPerHour: number;
  timestamp: Date;
  details?: string;
}

@Injectable()
export class SelfHealingGuardService {
  private readonly logger = new Logger(SelfHealingGuardService.name);
  private readonly loopBreakerMap = new Map<
    string,
    { count: number; firstAttempt: number; lastAttempt: number }
  >();
  private activeRemediationCount = 0;
  private readonly MAX_CONCURRENT_REMEDIATIONS = 3;
  private readonly MAX_ATTEMPTS_PER_HOUR = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly killSwitchService: KillSwitchService,
  ) {}

  /**
   * Evaluates safety guardrails before allowing an autonomous self-healing remediation to execute.
   */
  async executeGuardedRemediation(
    dto: TriggerRemediationWithGuardDto,
    remediationFn: () => Promise<any>,
  ): Promise<GuardedRemediationResult> {
    const now = Date.now();

    // 1. Check Global & Action Kill Switches (Non-negotiable)
    try {
      this.killSwitchService.assertExecutionAllowed(dto.tenantId, undefined, dto.actionType);
    } catch (err: any) {
      this.logger.error(`Self-healing remediation blocked by active KILL SWITCH for action: ${dto.actionType}`);
      throw new ForbiddenException(`Autonomous remediation halted. Kill switch active for '${dto.actionType}': ${err.message}`);
    }

    // 2. Concurrency Limiting
    if (this.activeRemediationCount >= this.MAX_CONCURRENT_REMEDIATIONS) {
      this.logger.warn(`Autonomous remediation concurrency limit reached (${this.activeRemediationCount} active)`);
      return {
        remediationKey: dto.remediationKey,
        actionType: dto.actionType,
        status: 'CONCURRENCY_BLOCKED',
        incidentCount: 0,
        maxAllowedPerHour: this.MAX_ATTEMPTS_PER_HOUR,
        timestamp: new Date(),
        details: 'Max concurrent remediation capacity reached. Throttling action.',
      };
    }

    // 3. Loop Breaker Check
    const loopData = this.loopBreakerMap.get(dto.remediationKey) || {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
    };

    // Reset window if more than 1 hour passed
    if (now - loopData.firstAttempt > 3600000) {
      loopData.count = 0;
      loopData.firstAttempt = now;
    }

    loopData.count += 1;
    loopData.lastAttempt = now;
    this.loopBreakerMap.set(dto.remediationKey, loopData);

    if (loopData.count > this.MAX_ATTEMPTS_PER_HOUR) {
      this.logger.error(
        `REMEDIATION LOOP BREAKER TRIPPED for key '${dto.remediationKey}'. ${loopData.count} attempts in 1h exceeded max ${this.MAX_ATTEMPTS_PER_HOUR}.`,
      );
      this.persistLoopBreaker(dto.remediationKey, loopData.count, 'LOOP_BLOCKED');

      return {
        remediationKey: dto.remediationKey,
        actionType: dto.actionType,
        status: 'LOOP_BLOCKED',
        incidentCount: loopData.count,
        maxAllowedPerHour: this.MAX_ATTEMPTS_PER_HOUR,
        timestamp: new Date(),
        details: 'Repeated remediation loop detected. Automatic execution halted for human review.',
      };
    }

    // 4. Execute Remediation Safely
    this.activeRemediationCount++;
    try {
      this.logger.log(`Dispatching governed self-healing remediation: ${dto.actionType} (${dto.remediationKey})`);
      await remediationFn();
      this.persistLoopBreaker(dto.remediationKey, loopData.count, 'ACTIVE');

      return {
        remediationKey: dto.remediationKey,
        actionType: dto.actionType,
        status: 'EXECUTED',
        incidentCount: loopData.count,
        maxAllowedPerHour: this.MAX_ATTEMPTS_PER_HOUR,
        timestamp: new Date(),
      };
    } finally {
      this.activeRemediationCount = Math.max(0, this.activeRemediationCount - 1);
    }
  }

  /**
   * Resets loop breaker history for a specific key following manual operator resolution.
   */
  resetLoopBreaker(remediationKey: string): void {
    this.loopBreakerMap.delete(remediationKey);
    this.logger.log(`Remediation loop breaker reset for key: ${remediationKey}`);
  }

  private async persistLoopBreaker(remediationKey: string, count: number, status: string) {
    try {
      await this.prisma.selfHealingLoopBreakerRecord.upsert({
        where: { remediationKey },
        update: {
          incidentCount: count,
          status,
          lastRemediatedAt: new Date(),
        },
        create: {
          remediationKey,
          incidentCount: count,
          maxAllowedPerHour: this.MAX_ATTEMPTS_PER_HOUR,
          status,
        },
      });
    } catch {
      // ignore in fast path
    }
  }
}
