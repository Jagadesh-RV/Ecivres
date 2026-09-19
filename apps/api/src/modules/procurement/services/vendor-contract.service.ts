import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VendorContractService {
  private readonly logger = new Logger(VendorContractService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createContract(organizationId: string, vendorName: string, totalBudget: number) {
    const contractId = `cnt_${Date.now()}`;
    this.logger.log(`Creating vendor procurement contract ${contractId} for ${vendorName} ($${totalBudget})`);
    return this.prisma.procurementContract.create({
      data: {
        contractId,
        organizationId,
        vendorName,
        totalBudget,
        status: totalBudget > 25000 ? 'PENDING_APPROVAL' : 'APPROVED',
      },
    });
  }

  async approveContract(contractId: string, approverId: string) {
    this.logger.log(`Approving procurement contract ${contractId} by ${approverId}`);
    return this.prisma.procurementContract.update({
      where: { contractId },
      data: {
        status: 'APPROVED',
        approvedBy: approverId,
      },
    });
  }
}
