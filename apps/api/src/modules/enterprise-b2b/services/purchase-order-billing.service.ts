import { Injectable, Logger } from '@nestjs/common';
import { EnterpriseOrganizationService } from './enterprise-organization.service';

export interface PurchaseOrderInvoice {
  id: string;
  poNumber: string;
  orgId: string;
  amountUsd: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'INVOICED' | 'PAID';
  dueDate: Date;
}

@Injectable()
export class PurchaseOrderBillingService {
  private readonly logger = new Logger(PurchaseOrderBillingService.name);
  private readonly invoicesMap = new Map<string, PurchaseOrderInvoice>();

  constructor(private readonly orgService: EnterpriseOrganizationService) {}

  async createPurchaseOrderInvoice(orgId: string, poNumber: string, amountUsd: number) {
    const org = await this.orgService.getOrgById(orgId);
    const netTermsDays = org ? org.netTermsDays : 30;
    const threshold = org ? org.approvalThresholdUsd : 1000;

    const requiresApproval = amountUsd > threshold;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + netTermsDays);

    const invoice: PurchaseOrderInvoice = {
      id: `inv_po_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      poNumber,
      orgId,
      amountUsd,
      status: requiresApproval ? 'PENDING_APPROVAL' : 'APPROVED',
      dueDate,
    };

    this.invoicesMap.set(invoice.id, invoice);
    this.logger.log(`Created PO Invoice ${invoice.id} for Org ${orgId}. Status: ${invoice.status}`);
    return invoice;
  }
}
