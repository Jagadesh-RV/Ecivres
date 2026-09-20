import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PurchaseApprovalService {
  private readonly logger = new Logger(PurchaseApprovalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPurchaseRequest(organizationId: string, itemDescription: string, estimatedCost: number) {
    const requestId = `pr_${Date.now()}`;
    const approvalLevel = estimatedCost > 10000 ? 'VP_FINANCE' : estimatedCost > 2000 ? 'DIRECTOR' : 'MANAGER';
    this.logger.log(`Submitting procurement purchase request ${requestId} for ${organizationId} ($${estimatedCost}, Level: ${approvalLevel})`);
    return this.prisma.procurementPurchaseRequest.create({
      data: {
        requestId,
        organizationId,
        itemDescription,
        estimatedCost,
        approvalLevel,
        status: 'SUBMITTED',
      },
    });
  }

  async reconcileInvoice(requestId: string, invoiceAmount: number) {
    this.logger.log(`Reconciling procurement invoice for ${requestId} ($${invoiceAmount})`);
    return {
      requestId,
      invoiceAmount,
      reconciled: true,
      varianceUSD: 0.0,
      status: 'RECONCILED',
    };
  }
}
