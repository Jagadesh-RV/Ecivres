import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GlobalPaymentRouterService } from './services/global-payment-router.service';

@ApiTags('payments-global')
@Controller('payments-global')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsGlobalController {
  constructor(private readonly paymentRouter: GlobalPaymentRouterService) {}

  @Post('select-gateway')
  @ApiOperation({ summary: 'Select optimal regional payment gateway' })
  async selectGateway(@Body() body: { countryCode: string; currency: string; method: string }) {
    return {
      gateway: this.paymentRouter.selectOptimalPaymentGateway(body.countryCode, body.currency, body.method),
    };
  }

  @Post('paypal')
  @ApiOperation({ summary: 'Process PayPal payment' })
  async payPal(@Body() body: { orderId: string; amount: number; currency: string }) {
    return this.paymentRouter.processPayPalPayment(body.orderId, body.amount, body.currency);
  }

  @Post('upi')
  @ApiOperation({ summary: 'Process Razorpay UPI payment' })
  async upi(@Body() body: { orderId: string; amountInr: number; vpaAddress: string }) {
    return this.paymentRouter.processRazorpayUpiPayment(body.orderId, body.amountInr, body.vpaAddress);
  }
}
