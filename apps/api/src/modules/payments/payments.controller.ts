import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':bookingId/pay')
  @ApiOperation({ summary: 'Process payment for a booking (simulate)' })
  async pay(
    @Param('bookingId') bookingId: string,
    @Body('transactionId') transactionId?: string,
  ) {
    // Generate a random transaction ID if not provided
    const txId = transactionId || 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    return this.paymentsService.processPayment(bookingId, txId);
  }

  @Post(':bookingId/intent')
  @ApiOperation({ summary: 'Create a Stripe Payment Intent for booking' })
  async createIntent(@Param('bookingId') bookingId: string) {
    return this.paymentsService.createPaymentIntent(bookingId);
  }

  @Get('provider/earnings')
  @ApiOperation({ summary: 'Get provider net earnings and payout history' })
  async getEarnings(@CurrentUser() user: any) {
    return this.paymentsService.getProviderEarningsSummary(user.id);
  }

  @Get('admin/transactions')
  @ApiOperation({ summary: 'Get all platform payments and fee ledger (Admin only)' })
  async getAdminTransactions() {
    return this.paymentsService.getAdminTransactions();
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get payment status of a booking' })
  async getPayment(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentByBooking(bookingId);
  }
}
