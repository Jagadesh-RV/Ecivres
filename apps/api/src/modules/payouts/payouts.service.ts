import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestPayoutDto } from './dto/request-payout.dto';

export interface PayoutRecord {
  id: string;
  providerUserId: string;
  amount: number;
  bankAccountName: string;
  accountLast4: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  requestedAt: Date;
  processedAt?: Date;
}

@Injectable()
export class PayoutsService {
  constructor(private prisma: PrismaService) {}

  private payoutsStore: PayoutRecord[] = [
    {
      id: 'payout-101',
      providerUserId: 'provider-user-1',
      amount: 450.0,
      bankAccountName: 'Acme Cleaning Services LLC',
      accountLast4: '9876',
      status: 'PENDING',
      requestedAt: new Date(),
    },
  ];

  async getPayoutSummary(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const userPayouts = this.payoutsStore.filter((p) => p.providerUserId === userId);
    const pendingAmount = userPayouts
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const paidOutAmount = userPayouts
      .filter((p) => p.status === 'APPROVED' || p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    // Mock total balance based on completed payments
    const availableBalance = Math.max(0, 1250.0 - paidOutAmount - pendingAmount);

    return {
      availableBalance: Number(availableBalance.toFixed(2)),
      pendingAmount: Number(pendingAmount.toFixed(2)),
      paidOutAmount: Number(paidOutAmount.toFixed(2)),
      history: userPayouts,
    };
  }

  async requestPayout(userId: string, dto: RequestPayoutDto): Promise<PayoutRecord> {
    const summary = await this.getPayoutSummary(userId);

    if (dto.amount > summary.availableBalance) {
      throw new BadRequestException(
        `Requested payout amount ($${dto.amount}) exceeds available balance ($${summary.availableBalance})`,
      );
    }

    const newPayout: PayoutRecord = {
      id: `payout-${Date.now()}`,
      providerUserId: userId,
      amount: dto.amount,
      bankAccountName: dto.bankAccountName,
      accountLast4: dto.accountNumber.slice(-4) || '1234',
      status: 'PENDING',
      requestedAt: new Date(),
    };

    this.payoutsStore.push(newPayout);
    return newPayout;
  }

  async getPendingPayouts(): Promise<PayoutRecord[]> {
    return this.payoutsStore.filter((p) => p.status === 'PENDING');
  }

  async approvePayout(payoutId: string): Promise<PayoutRecord> {
    const payout = this.payoutsStore.find((p) => p.id === payoutId);
    if (!payout) {
      throw new NotFoundException(`Payout request '${payoutId}' not found`);
    }

    payout.status = 'APPROVED';
    payout.processedAt = new Date();
    return payout;
  }
}
