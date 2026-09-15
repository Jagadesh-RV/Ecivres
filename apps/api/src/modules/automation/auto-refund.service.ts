import { Injectable, Logger } from '@nestjs/common';

export interface SlaBreachRefundResult {
  bookingId: string;
  refundAmount: number;
  autoApproved: boolean;
  reason: string;
  escalatedToSupport: boolean;
}

@Injectable()
export class AutoRefundService {
  private readonly logger = new Logger(AutoRefundService.name);
  private readonly autoRefundLimit = 150;

  evaluateSlaRefund(bookingId: string, delayMinutes: number, bookingAmount: number): SlaBreachRefundResult {
    if (delayMinutes >= 60 && bookingAmount <= this.autoRefundLimit) {
      this.logger.warn(`AUTOMATED SLA REFUND ISSUED for booking ${bookingId}: \$${bookingAmount} refunded due to ${delayMinutes}m delay`);
      return {
        bookingId,
        refundAmount: bookingAmount,
        autoApproved: true,
        reason: `Automated SLA breach refund (${delayMinutes}m provider delay)`,
        escalatedToSupport: false,
      };
    }

    this.logger.log(`Escalated SLA refund for booking ${bookingId} (\$${bookingAmount}) to Support Agent review`);
    return {
      bookingId,
      refundAmount: bookingAmount,
      autoApproved: false,
      reason: 'Exceeds automated refund cap, escalated to human agent',
      escalatedToSupport: true,
    };
  }
}
