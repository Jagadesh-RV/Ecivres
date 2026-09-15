import { Injectable, Logger } from '@nestjs/common';

export interface BookingApprovalRequest {
  bookingId: string;
  requesterUserId: string;
  amount: number;
  departmentId: string;
}

export interface ApprovalChainResult {
  approvalRequired: boolean;
  status: 'APPROVED' | 'PENDING_MANAGER_APPROVAL' | 'REJECTED';
  approverRole?: string;
  reason: string;
}

@Injectable()
export class ApprovalWorkflowService {
  private readonly logger = new Logger(ApprovalWorkflowService.name);
  private readonly autoApproveThreshold = 250;

  evaluateBookingApproval(req: BookingApprovalRequest): ApprovalChainResult {
    if (req.amount <= this.autoApproveThreshold) {
      this.logger.log(`Booking ${req.bookingId} (\$${req.amount}) auto-approved under \$${this.autoApproveThreshold} threshold`);
      return {
        approvalRequired: false,
        status: 'APPROVED',
        reason: 'Below automatic manager approval threshold',
      };
    }

    this.logger.log(`Booking ${req.bookingId} (\$${req.amount}) routed to Department Manager for approval`);
    return {
      approvalRequired: true,
      status: 'PENDING_MANAGER_APPROVAL',
      approverRole: 'DEPARTMENT_MANAGER',
      reason: 'Exceeds employee self-service spend limit',
    };
  }
}
