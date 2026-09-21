import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WhatsAppMessagingService } from './services/whatsapp-messaging.service';

@ApiTags('whatsapp')
@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WhatsAppController {
  constructor(private readonly waService: WhatsAppMessagingService) {}

  @Post('send-confirmation')
  @ApiOperation({ summary: 'Send booking confirmation via WhatsApp' })
  async sendConfirmation(@Body() body: { phone: string; bookingId: string; serviceName: string; date: string }) {
    return this.waService.sendBookingConfirmation(body.phone, body.bookingId, body.serviceName, body.date);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send login verification OTP via WhatsApp' })
  async sendOtp(@Body() body: { phone: string; otpCode: string }) {
    return this.waService.sendVerificationOtp(body.phone, body.otpCode);
  }
}
