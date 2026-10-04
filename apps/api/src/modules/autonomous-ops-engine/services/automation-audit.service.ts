import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface LogExecutionParams {
  policyId: string;
  triggerContext: Record<string, any>;
  actionTaken: string;
  authorizationRole: string;
  actorId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING_APPROVAL';
  result: Record<string, any>;
}

@Injectable()
export class AutomationAuditService {
  private readonly logger = new Logger(AutomationAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logExecution(params: LogExecutionParams) {
    this.logger.log(`Logging automation execution for policy ${params.policyId}: ${params.status}`);
    return this.prisma.automationExecution.create({
      data: {
        policyId: params.policyId,
        triggerContext: params.triggerContext as any,
        actionTaken: params.actionTaken,
        authorizationRole: params.authorizationRole,
        actorId: params.actorId,
        status: params.status,
        result: params.result as any,
      },
    });
  }

  async getRecentExecutions(policyId?: string) {
    const where: any = {};
    if (policyId) where.policyId = policyId;
    return this.prisma.automationExecution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
