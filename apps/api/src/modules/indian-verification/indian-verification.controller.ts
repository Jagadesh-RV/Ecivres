import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IndianVerificationService } from './services/indian-verification.service';

@ApiTags('indian-verification')
@Controller('indian-verification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IndianVerificationController {
  constructor(private readonly verificationService: IndianVerificationService) {}

  @Post('verify-aadhaar')
  @ApiOperation({ summary: 'Verify provider Aadhaar ID' })
  async verifyAadhaar(@Body() body: { providerId: string; aadhaarNumber: string }) {
    return this.verificationService.verifyAadhaar(body.providerId, body.aadhaarNumber);
  }

  @Post('verify-pan')
  @ApiOperation({ summary: 'Verify provider PAN card' })
  async verifyPan(@Body() body: { providerId: string; panNumber: string }) {
    return this.verificationService.verifyPan(body.providerId, body.panNumber);
  }

  @Post('verify-gst')
  @ApiOperation({ summary: 'Verify provider GSTIN registration' })
  async verifyGst(@Body() body: { providerId: string; gstin: string }) {
    return this.verificationService.verifyGstin(body.providerId, body.gstin);
  }

  @Get('status/:providerId')
  @ApiOperation({ summary: 'Get provider verification status summary' })
  async getStatus(@Param('providerId') providerId: string) {
    return this.verificationService.getVerificationStatus(providerId);
  }
}
