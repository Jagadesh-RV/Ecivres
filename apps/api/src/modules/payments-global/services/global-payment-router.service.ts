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
}
