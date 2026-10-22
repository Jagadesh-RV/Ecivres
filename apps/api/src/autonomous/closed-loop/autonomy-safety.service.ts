import { Injectable, Logger, ForbiddenException } from '@nestjs/common';

export enum AutonomyLevel {
  LEVEL_0_OBSERVE = 0,
  LEVEL_1_RECOMMEND = 1,
  LEVEL_2_EXECUTE_LOW_RISK = 2,
  LEVEL_3_EXECUTE_MEDIUM_RISK = 3,
  LEVEL_4_HUMAN_APPROVAL_HIGH = 4,
  LEVEL_5_EMERGENCY_REMEDIATION = 5,
}

@Injectable()
export class AutonomySafetyService {
  private readonly logger = new Logger(AutonomySafetyService.name);
  private currentLevel: AutonomyLevel = AutonomyLevel.LEVEL_3_EXECUTE_MEDIUM_RISK;

  getAutonomyLevel(): AutonomyLevel {
    return this.currentLevel;
  }

  setAutonomyLevel(level: AutonomyLevel, actorId: string, reason: string): AutonomyLevel {
    this.logger.warn(`Platform Autonomy Level transitioned to ${AutonomyLevel[level]} (${level}) by ${actorId}: ${reason}`);
    this.currentLevel = level;
    return this.currentLevel;
  }

  /**
   * Enforces strict safety boundary checks.
   * INVARIANT: Never allows prohibited dangerous actions regardless of autonomy level.
   */
  assertActionAllowed(actionType: string, payload: Record<string, any>): void {
    // 1. Prohibited operations check
    const prohibitedKeywords = [
      'DELETE_USER',
      'CHANGE_AUTH_SECRETS',
      'DISABLE_FRAUD_CHECKS',
      'DISABLE_MFA',
      'CHANGE_PAYOUT_DESTINATION',
      'UNLIMITED_REFUND',
      'MODIFY_TAX_CONFIG',
      'ELEVATE_PERMISSIONS',
    ];

    for (const keyword of prohibitedKeywords) {
      if (actionType.toUpperCase().includes(keyword)) {
        this.logger.error(`PROHIBITED ACTION ATTEMPT BLOCKED: ${actionType}`);
        throw new ForbiddenException(`Action '${actionType}' violates platform safety boundaries and is strictly prohibited.`);
      }
    }

    // 2. Financial cap sanity check
    if (payload.amount && typeof payload.amount === 'number') {
      if (payload.amount > 50000) {
        throw new ForbiddenException(`Single autonomous transaction amount $${payload.amount} breaches platform safety ceiling ($50,000).`);
      }
    }
  }
}
