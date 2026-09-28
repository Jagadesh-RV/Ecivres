import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RegionalKycRulesService } from './services/regional-kyc-rules.service';

@ApiTags('verification-global')
@Controller('verification-global')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VerificationGlobalController {
  constructor(private readonly kycRulesService: RegionalKycRulesService) {}

  @Get('rules/:countryCode')
  @ApiOperation({ summary: 'Get required KYC document rules for country' })
  async getRules(@Param('countryCode') countryCode: string) {
    return this.kycRulesService.getRequiredKycDocuments(countryCode);
  }

  @Post('verify-doc')
  @ApiOperation({ summary: 'Verify provider regional KYC document' })
  async verifyDoc(@Body() body: { providerId: string; countryCode: string; docType: string; docNumber: string }) {
    return this.kycRulesService.verifyRegionalDocument(body.providerId, body.countryCode, body.docType, body.docNumber);
  }
}
