import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SmartEscrowService {
  private readonly logger = new Logger(SmartEscrowService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createEscrow(bookingId: string, amount: number, milestone: string) {
    const escrowId = `esc_${Date.now()}`;
    this.logger.log(`Creating smart contract escrow ${escrowId} for booking ${bookingId} ($${amount})`);
    return this.prisma.smartContractEscrow.create({
      data: {
        escrowId,
        bookingId,
        amount,
        milestone,
        isReleased: false,
        disputeStatus: 'NONE',
      },
    });
  }

  async releaseMilestone(escrowId: string) {
    this.logger.log(`Automatically releasing smart contract escrow ${escrowId} milestone payment`);
    return this.prisma.smartContractEscrow.update({
      where: { escrowId },
      data: { isReleased: true },
    });
  }
}
