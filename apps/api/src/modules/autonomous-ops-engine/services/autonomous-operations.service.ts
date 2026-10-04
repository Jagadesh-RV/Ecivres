import { Injectable, Logger } from '@nestjs/common';
import { AutomationPolicyService } from './automation-policy.service';
import { AutomationApprovalService } from './automation-approval.service';
import { AutomationAuditService } from './automation-audit.service';

export interface DispatchEventParams {
  eventName: string;
  context: Record<string, any>;
  actorId: string;
  actorRole: string;
}

@Injectable()
export class AutonomousOperationsService {
  private readonly logger = new Logger(AutonomousOperationsService.name);

  constructor(
    private readonly policyService: AutomationPolicyService,
    private readonly approvalService: AutomationApprovalService,
    private readonly auditService: AutomationAuditService,
  ) {}

  async evaluateAndExecuteEvent(params: DispatchEventParams) {
    this.logger.log(`Evaluating event ${params.eventName} for autonomous actions...`);

    const activePolicies = await this.policyService.getActivePolicies(params.eventName);

    if (activePolicies.length === 0) {
      return { executed: false, reason: 'NO_MATCHING_POLICY' };
    }

    const results = [];

    for (const policy of activePolicies) {
      if (policy.requiresApproval) {
        this.logger.log(`Policy ${policy.name} requires human approval. Enqueuing request...`);
        const approvalReq = await this.approvalService.createApprovalRequest({
          actionType: policy.actionType,
          requestedBy: params.actorId,
          context: { policyName: policy.name, eventContext: params.context },
        });

        await this.auditService.logExecution({
          policyId: policy.id,
          triggerContext: params.context,
          actionTaken: policy.actionType,
          authorizationRole: params.actorRole,
          actorId: params.actorId,
          status: 'PENDING_APPROVAL',
          result: { approvalRequestId: approvalReq.id },
        });

        results.push({ policyName: policy.name, status: 'PENDING_APPROVAL', approvalRequestId: approvalReq.id });
      } else {
        this.logger.log(`Policy ${policy.name} executing autonomously without approval...`);
        await this.auditService.logExecution({
          policyId: policy.id,
          triggerContext: params.context,
          actionTaken: policy.actionType,
          authorizationRole: params.actorRole,
          actorId: params.actorId,
          status: 'SUCCESS',
          result: { autoExecuted: true },
        });

        results.push({ policyName: policy.name, status: 'EXECUTED_AUTONOMOUSLY' });
      }
    }

    return { executed: true, results };
  }
}
