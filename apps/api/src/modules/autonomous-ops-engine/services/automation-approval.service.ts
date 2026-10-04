import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateApprovalRequestDto } from '../dto/create-approval-request.dto';
import { ReviewApprovalRequestDto, ApprovalActionDto } from '../dto/review-approval-request.dto';

@Injectable()
export class AutomationApprovalService {
  private readonly logger = new Logger(AutomationApprovalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createApprovalRequest(dto: CreateApprovalRequestDto) {
    this.logger.warn(`Creating human-in-the-loop approval request for action: ${dto.actionType}`);
    return this.prisma.approvalRequest.create({
      data: {
        actionType: dto.actionType,
        requestedBy: dto.requestedBy,
        context: dto.context as any,
        riskLevel: (dto.riskLevel as any) ?? 'MEDIUM',
        status: 'PENDING',
      },
    });
  }

  async reviewRequest(id: string, reviewerId: string, dto: ReviewApprovalRequestDto) {
    this.logger.log(`Reviewing approval request ${id} by reviewer ${reviewerId}: ${dto.action}`);

    const req = await this.prisma.approvalRequest.findUnique({ where: { id } });
    if (!req) {
      throw new NotFoundException(`Approval request ${id} not found`);
    }

    const newStatus = dto.action === ApprovalActionDto.APPROVED ? 'APPROVED' : 'REJECTED';

    return this.prisma.approvalRequest.update({
      where: { id },
      data: {
        status: newStatus as any,
        reviewedBy: reviewerId,
        reviewReason: dto.reason,
      },
    });
  }

  async getPendingApprovals() {
    return this.prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
