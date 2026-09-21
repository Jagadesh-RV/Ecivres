import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { StripeConnectService } from './services/stripe-connect.service';
import { StripeWebhookService } from './services/stripe-webhook.service';

@ApiTags('stripe-connect')
@Controller('stripe-connect')
export class StripeConnectController {
  constructor(
    private readonly connectService: StripeConnectService,
    private readonly webhookService: StripeWebhookService,
  ) {}

  @Post('onboarding-link')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate Stripe Connect Express onboarding link' })
  async generateOnboardingLink(@Body('providerId') providerId: string) {
    return this.connectService.generateOnboardingLink(providerId);
  }

  @Get('account-status/:providerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Stripe Connect account status and payout eligibility' })
  async getAccountStatus(@Param('providerId') providerId: string) {
    return this.connectService.getAccountStatus(providerId);
  }

  @Post('webhooks/payout')
  @ApiOperation({ summary: 'Stripe Payout and Account update webhook listener' })
  async handleWebhook(@Body() payload: any) {
    return this.webhookService.handlePayoutWebhook(payload);
  }
}
