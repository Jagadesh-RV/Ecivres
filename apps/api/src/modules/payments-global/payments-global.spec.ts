import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalPaymentRouterService } from './services/global-payment-router.service';

describe('GlobalPaymentRouterService', () => {
  let service: GlobalPaymentRouterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalPaymentRouterService],
    }).compile();

    service = module.get<GlobalPaymentRouterService>(GlobalPaymentRouterService);
  });

  it('should route Indian INR transactions to Razorpay', () => {
    const gateway = service.selectOptimalPaymentGateway('IN', 'INR', 'CARD');
    expect(gateway).toBe('RAZORPAY');
  });

  it('should process PayPal transaction cleanly', async () => {
    const res = await service.processPayPalPayment('ord_1', 100, 'USD');
    expect(res.gateway).toBe('PAYPAL');
    expect(res.status).toBe('COMPLETED');
  });

  it('should process Razorpay UPI transaction cleanly', async () => {
    const res = await service.processRazorpayUpiPayment('ord_2', 2500, 'user@upi');
    expect(res.gateway).toBe('RAZORPAY_UPI');
    expect(res.status).toBe('COMPLETED');
  });
});
