import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GlobalPaymentRouterService {
  private readonly logger = new Logger(GlobalPaymentRouterService.name);

  selectOptimalPaymentGateway(countryCode: string, currency: string, method: string): string {
    if (countryCode === 'IN' || currency === 'INR') {
      return 'RAZORPAY';
    }
    if (method === 'PAYPAL') {
      return 'PAYPAL';
    }
    if (method === 'UPI') {
      return 'RAZORPAY_UPI';
    }
    return 'STRIPE_GLOBAL';
  }

  async processPayPalPayment(orderId: string, amount: number, currency: string) {
    this.logger.log(`Processing PayPal Payment for Order ${orderId}: ${amount} ${currency}`);
    return {
      transactionId: `pp_tx_${Date.now()}`,
      gateway: 'PAYPAL',
      status: 'COMPLETED',
      orderId,
      amount,
      currency,
    };
  }

  async processRazorpayUpiPayment(orderId: string, amountInr: number, vpaAddress: string) {
    this.logger.log(`Processing Razorpay UPI Payment for Order ${orderId}: ₹${amountInr} via VPA ${vpaAddress}`);
    return {
      transactionId: `rzp_upi_${Date.now()}`,
      gateway: 'RAZORPAY_UPI',
      status: 'COMPLETED',
      vpaAddress,
      amountInr,
    };
  }
}
