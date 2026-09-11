import { Injectable, BadRequestException } from '@nestjs/common';

export interface SplitParty {
  email: string;
  shareAmount: number;
  status: 'PENDING' | 'PAID';
}

export interface SplitPaymentGroup {
  bookingId: string;
  totalAmount: number;
  parties: SplitParty[];
  createdAt: Date;
}

export interface EmiSchedule {
  months: number;
  monthlyInstallment: number;
  interestRatePercent: number;
  totalPayable: number;
}

@Injectable()
export class SplitPaymentService {
  private splitGroups: Map<string, SplitPaymentGroup> = new Map();

  async createSplitBooking(bookingId: string, totalAmount: number, emails: string[]): Promise<SplitPaymentGroup> {
    if (emails.length === 0) throw new BadRequestException('At least one co-payer email is required');

    const shareAmount = Math.round(totalAmount / emails.length);
    const parties: SplitParty[] = emails.map((email) => ({
      email,
      shareAmount,
      status: 'PENDING',
    }));

    const group: SplitPaymentGroup = {
      bookingId,
      totalAmount,
      parties,
      createdAt: new Date(),
    };

    this.splitGroups.set(bookingId, group);
    return group;
  }

  async calculateEmiOptions(amount: number): Promise<EmiSchedule[]> {
    const plans = [3, 6, 12];
    return plans.map((months) => {
      const interestRatePercent = months === 3 ? 0 : months === 6 ? 5 : 9;
      const interestAmount = (amount * interestRatePercent) / 100;
      const totalPayable = Math.round(amount + interestAmount);
      const monthlyInstallment = Math.round(totalPayable / months);

      return {
        months,
        monthlyInstallment,
        interestRatePercent,
        totalPayable,
      };
    });
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    const rates: Record<string, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.2,
      CAD: 1.35,
    };

    const fromRate = rates[fromCurrency.toUpperCase()] || 1.0;
    const toRate = rates[toCurrency.toUpperCase()] || 1.0;

    const amountInUSD = amount / fromRate;
    return Number((amountInUSD * toRate).toFixed(2));
  }
}
