import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ActionDefinition {
  actionType: string;
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  autonomyLevelRequired: number; // 0 to 5
  maxMonetaryLimit: number;
  requiredRole: string;
  requiredPermission: string;
  approvalLevelRequired: number;
  isEnabled: boolean;
  compensationSupported: boolean;
  parametersSchema?: Record<string, any>;
}

@Injectable()
export class ActionCatalogService {
  private readonly logger = new Logger(ActionCatalogService.name);
  private readonly catalog = new Map<string, ActionDefinition>();

  constructor(private readonly prisma: PrismaService) {
    this.seedDefaultCatalog();
  }

  private seedDefaultCatalog(): void {
    const defaults: ActionDefinition[] = [
      {
        actionType: 'MARKETPLACE_PROMOTION_ADJUST',
        name: 'Marketplace Promotion Adjustment',
        description: 'Adjust promotional campaign discounts or multipliers within safe monetary limits',
        riskLevel: 'MEDIUM',
        autonomyLevelRequired: 2,
        maxMonetaryLimit: 5000.0,
        requiredRole: 'MARKETPLACE_MANAGER',
        requiredPermission: 'campaigns:manage',
        approvalLevelRequired: 1,
        isEnabled: true,
        compensationSupported: true,
        parametersSchema: {
          campaignId: 'string',
          discountPercentageDelta: 'number',
          budgetCap: 'number',
        },
      },
      {
        actionType: 'PRICING_DYNAMIC_SURGE',
        name: 'Dynamic Surge Pricing Adjustment',
        description: 'Apply controlled dynamic surge pricing shift for supply/demand equilibrium',
        riskLevel: 'HIGH',
        autonomyLevelRequired: 3,
        maxMonetaryLimit: 25.0, // max 25% surge
        requiredRole: 'PRICING_OFFICER',
        requiredPermission: 'pricing:override',
        approvalLevelRequired: 2,
        isEnabled: true,
        compensationSupported: true,
        parametersSchema: {
          serviceId: 'string',
          region: 'string',
          surgeMultiplier: 'number',
        },
      },
      {
        actionType: 'PROVIDER_INCENTIVE_PAYOUT',
        name: 'Provider Supply Incentive Payout',
        description: 'Direct provider incentive bonus to mobilize critical category supply',
        riskLevel: 'HIGH',
        autonomyLevelRequired: 3,
        maxMonetaryLimit: 2500.0,
        requiredRole: 'FINANCE_ADMIN',
        requiredPermission: 'payouts:execute',
        approvalLevelRequired: 2,
        isEnabled: true,
        compensationSupported: false,
        parametersSchema: {
          providerId: 'string',
          incentiveAmount: 'number',
          reasonCode: 'string',
        },
      },
      {
        actionType: 'CUSTOMER_RETENTION_CREDIT',
        name: 'Customer Retention Credit Issuance',
        description: 'Issue appeasement or retention credits to churn-risk customers',
        riskLevel: 'MEDIUM',
        autonomyLevelRequired: 2,
        maxMonetaryLimit: 50.0,
        requiredRole: 'SUPPORT_LEAD',
        requiredPermission: 'finance:credits',
        approvalLevelRequired: 1,
        isEnabled: true,
        compensationSupported: false,
        parametersSchema: {
          customerId: 'string',
          creditAmount: 'number',
          expiryDays: 'number',
        },
      },
      {
        actionType: 'OPERATIONAL_REMEDIATION_RETRY',
        name: 'Operational Workflow Auto-Remediation',
        description: 'Automatically retry failed non-critical workflow tasks and notifications',
        riskLevel: 'LOW',
        autonomyLevelRequired: 1,
        maxMonetaryLimit: 0.0,
        requiredRole: 'SYSTEM_BOT',
        requiredPermission: 'ops:remediate',
        approvalLevelRequired: 0,
        isEnabled: true,
        compensationSupported: true,
        parametersSchema: {
          workflowId: 'string',
          retryAttempt: 'number',
        },
      },
      {
        actionType: 'QUEUE_DEAD_LETTER_RETRY',
        name: 'Dead Letter Queue Recovery',
        description: 'Re-enqueue failed DLQ jobs with sanitization and backoff',
        riskLevel: 'LOW',
        autonomyLevelRequired: 1,
        maxMonetaryLimit: 0.0,
        requiredRole: 'SYSTEM_BOT',
        requiredPermission: 'queue:manage',
        approvalLevelRequired: 0,
        isEnabled: true,
        compensationSupported: true,
        parametersSchema: {
          jobId: 'string',
          queueName: 'string',
        },
      },
      {
        actionType: 'PROVIDER_RECRUITMENT_OUTREACH',
        name: 'Targeted Provider Recruitment Notification',
        description: 'Dispatch localized recruitment notifications to eligible off-duty providers',
        riskLevel: 'LOW',
        autonomyLevelRequired: 2,
        maxMonetaryLimit: 0.0,
        requiredRole: 'OPS_COORDINATOR',
        requiredPermission: 'providers:notify',
        approvalLevelRequired: 0,
        isEnabled: true,
        compensationSupported: false,
        parametersSchema: {
          category: 'string',
          targetZone: 'string',
          providerIds: 'array',
        },
      },
      {
        actionType: 'MARKETPLACE_CAMPAIGN_MODULATE',
        name: 'Marketplace Campaign Modulation',
        description: 'Scale or throttle active regional campaigns based on real-time liquidity',
        riskLevel: 'MEDIUM',
        autonomyLevelRequired: 2,
        maxMonetaryLimit: 10000.0,
        requiredRole: 'MARKETING_LEAD',
        requiredPermission: 'campaigns:execute',
        approvalLevelRequired: 1,
        isEnabled: true,
        compensationSupported: true,
        parametersSchema: {
          campaignId: 'string',
          budgetMultiplier: 'number',
        },
      },
    ];

    for (const def of defaults) {
      this.catalog.set(def.actionType, def);
    }
    this.logger.log(`Initialized Action Catalog with ${defaults.length} governed actions.`);
  }

  getAction(actionType: string): ActionDefinition {
    const action = this.catalog.get(actionType);
    if (!action) {
      throw new NotFoundException(`Action type '${actionType}' is not registered in Action Catalog.`);
    }
    return action;
  }

  getAllActions(): ActionDefinition[] {
    return Array.from(this.catalog.values());
  }

  registerAction(definition: ActionDefinition): ActionDefinition {
    if (!definition.actionType || !definition.name) {
      throw new BadRequestException('actionType and name are required to register an action.');
    }
    this.catalog.set(definition.actionType, definition);
    this.logger.log(`Registered custom action: ${definition.actionType} (${definition.riskLevel})`);
    return definition;
  }

  validateMonetaryLimit(actionType: string, requestedAmount: number): boolean {
    const action = this.getAction(actionType);
    if (action.maxMonetaryLimit > 0 && requestedAmount > action.maxMonetaryLimit) {
      throw new BadRequestException(
        `Requested amount $${requestedAmount} exceeds maximum allowed limit of $${action.maxMonetaryLimit} for action ${actionType}.`,
      );
    }
    return true;
  }

  requiresApproval(actionType: string, requestedAmount: number = 0): boolean {
    const action = this.getAction(actionType);
    if (action.riskLevel === 'HIGH' || action.riskLevel === 'CRITICAL') {
      return true;
    }
    if (action.maxMonetaryLimit > 0 && requestedAmount > action.maxMonetaryLimit * 0.5) {
      return true; // Over 50% of cap requires approval
    }
    return action.approvalLevelRequired > 0 && action.autonomyLevelRequired >= 3;
  }
}
